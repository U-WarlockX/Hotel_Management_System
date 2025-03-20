import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable"; 

const Dashboard = () => {
  const [staffStats, setStaffStats] = useState({
    totalStaff: 0,
    onDuty: 0,
    attendanceRate: 0,
    openPositions: 0,
    activeStaff: 0,
  });

  const [staff, setStaff] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/staff");
      const totalStaff = response.data.length;
      const onDuty = response.data.filter(
        (staffMember) => staffMember.status === "Active"
      ).length;
      const attendanceRate =
        totalStaff > 0 ? ((onDuty / totalStaff) * 100).toFixed(2) : 0;
      const activeResponse = await axios.get(
        "http://localhost:5000/api/staff/active-count"
      );
      const openPositions = totalStaff - onDuty;

      setStaffStats({
        totalStaff,
        onDuty,
        attendanceRate,
        openPositions,
        activeStaff: activeResponse.data.activeStaff || 0,
      });

      setStaff(response.data);
    } catch (err) {
      console.error("Error fetching staff data:", err);
    }
  };

  const handleAddStaff = () => navigate("/staff/add");

  // Export Excel function
  const handleExportExcel = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/staff/export/excel", // Correct API endpoint for Excel
        { responseType: "blob" } // Ensure response is a file (Excel)
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "staff_data.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting staff data to Excel:", error);
    }
  };

  // Export PDF function
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.text("Staff List", 14, 20);
  
    const tableData = staff.slice(0, 5).map((staffMember) => [
      staffMember.firstName + " " + staffMember.lastName,
      staffMember.jobTitle,
      staffMember.department,
      staffMember.status,
    ]);
  
    doc.autoTable({
      head: [["Name", "Role", "Department", "Status"]],
      body: tableData,
      startY: 30,
    });
  
    doc.save("staff_data.pdf");
  };
  

  const renderStatusBadge = (status) =>
    status === "Active" ? (
      <span className="bg-green-400 text-xs font-medium px-2.5 py-0.5 rounded-full text-white">
        Active
      </span>
    ) : (
      <span className="bg-red-500 text-xs font-medium px-2.5 py-0.5 rounded-full text-white">
        Inactive
      </span>
    );

  return (
    <div>
      {/* Add Staff Button */}
      <div className="text-right mb-6">
        <button
          onClick={handleAddStaff}
          className="bg-green-600 text-white px-6 py-2 text-xs font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Add New Staff
        </button>
        <button
          onClick={handleExportExcel}
          className="bg-blue-600 text-white px-6 py-2 text-xs font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ml-4"
        >
          Export Excel
        </button>
        <button
          onClick={handleExportPDF}
          className="bg-red-600 text-white px-6 py-2 text-xs font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 ml-4"
        >
          Export PDF
        </button>
      </div>

      {/* Staff Statistics with Glassmorphism */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {[ 
          { title: "Total Staff", value: staffStats.totalStaff },
          { title: "On Duty Today", value: staffStats.onDuty },
          { title: "Attendance Rate", value: `${staffStats.attendanceRate}%` },
          { title: "Open Positions", value: staffStats.openPositions },
          { title: "Active Staff", value: staffStats.activeStaff },
        ].map((stat, index) => (
          <div
            key={index}
            className="p-6 rounded-lg shadow-lg border border-white/40 bg-white/30 backdrop-blur-md flex flex-col items-center"
          >
            <h3 className="text-sm font-bold text-black text-center">{stat.title}</h3>
            <p className="text-lg font-bold text-black">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Staff Table with Glassmorphism and Custom Scrollbar */}
      <div className="p-6 rounded-lg shadow-md border border-white/40 bg-white/30 backdrop-blur-md mt-6">
        <h2 className="text-lg font-semibold text-black mb-6">Current Staff</h2>
        <div className="overflow-x-auto">
          <div className="max-h-80 overflow-y-auto custom-scrollbar">
            <table className="min-w-full table-auto text-left">
              <thead>
                <tr className="bg-white/40 border-b">
                  {["Profile", "Name", "Role", "Department", "Status"].map(
                    (header, i) => (
                      <th key={i} className="py-3 px-6 text-sm font-medium text-black">
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {staff.slice(0, 5).map((staffMember) => (
                  <tr
                    key={staffMember._id}
                    className="border-b hover:bg-white/40 transition-all duration-300"
                  >
                    <td className="py-3 px-6">
                      <img
                        src={staffMember.profilePic ? `http://localhost:5000/uploads/${staffMember.profilePic}` : "/default-avatar.jpg"}
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </td>
                    <td className="text-sm py-3 px-6 text-black">
                      {staffMember.firstName} {staffMember.lastName}
                    </td>
                    <td className="text-sm py-3 px-6 text-black">{staffMember.jobTitle}</td>
                    <td className="text-sm py-3 px-6 text-black">{staffMember.department}</td>
                    <td className="text-sm py-3 px-6 text-black">
                      {renderStatusBadge(staffMember.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
