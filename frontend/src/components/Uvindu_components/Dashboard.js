import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    const fetchStats = async () => {
      try {
        // Fetching all staff data
        const response = await axios.get("http://localhost:5000/api/staff");
        const totalStaff = response.data.length;

        // Counting the staff who are on duty
        const onDuty = response.data.filter(
          (staffMember) => staffMember.status === "Active"
        ).length;

        // Calculating attendance rate
        const attendanceRate =
          totalStaff > 0 ? ((onDuty / totalStaff) * 100).toFixed(2) : 0;

        // Fetching active staff separately
        const activeResponse = await axios.get(
          "http://localhost:5000/api/staff/active-count"
        );

        // Calculating open positions (totalStaff - onDuty)
        const openPositions = totalStaff - onDuty;

        // Updating the state with the calculated stats
        setStaffStats({
          totalStaff,
          onDuty,
          attendanceRate,
          openPositions,
          activeStaff: activeResponse.data.activeStaff || 0,
        });

        // Storing the staff data
        setStaff(response.data);
      } catch (err) {
        console.error("Error fetching staff data:", err);
      }
    };

    fetchStats();
  }, []);

  const handleAddStaff = () => {
    navigate("/staff/add");
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this staff member?"
    );
    if (confirmDelete) {
      try {
        const response = await axios.delete(
          `http://localhost:5000/api/staff/${id}`
        );
        if (response.status === 200) {
          setStaff(staff.filter((staffMember) => staffMember._id !== id));
        }
      } catch (err) {
        console.error("Error deleting staff:", err);
        alert("An error occurred while deleting the staff member.");
      }
    }
  };

  const renderStatusBadge = (status) => {
    if (status === "Active") {
      return (
        <span className="bg-green-400 text-green-400 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-200 dark:text-green-600">
          Active
        </span>
      );
    } else {
      return (
        <span className="bg-red-100 text-red-100 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-red-300 dark:text-red-900">
          Inactive
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      {/* Centered Content Wrapper */}
      <div className="w-full max-w-7xl bg-white p-6 rounded-lg shadow-lg">
        {/* Button to add new staff */}
        <div className="text-right mb-6">
          <button
            onClick={handleAddStaff}
            className="bg-green-600 text-white px-6 py-2 text-xs font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Add New Staff
          </button>
        </div>


        {/* Grid Layout for Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Dashboard cards */}
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-700">Total Staff</h3>
            <p className="text-lg font-bold text-gray-900">{staffStats.totalStaff}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-700">On Duty Today</h3>
            <p className="text-lg font-bold text-blue-600">{staffStats.onDuty}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-700">Attendance Rate</h3>
            <p className="text-lg font-bold text-yellow-500">{staffStats.attendanceRate}%</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-700">Open Positions</h3>
            <p className="text-lg font-bold text-red-600">{staffStats.openPositions}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-700">Active Staff</h3>
            <p className="text-lg font-bold text-green-600">{staffStats.activeStaff}</p>
          </div>
        </div>

        {/* Staff List Table */}
        <div className="col-span-4 bg-white p-6 rounded-lg shadow-md border border-gray-200 mt-6">
  <h2 className="text-lg font-semibold text-gray-800 mb-6">Current Staff</h2>
  <div className="overflow-x-auto">
    <div className="max-h-80 overflow-y-auto"> {/* Added max height and overflow */}
      <table className="min-w-full table-auto text-left">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="py-3 px-6 text-sm font-medium text-gray-700">Profile</th>
            <th className="py-3 px-6 text-sm font-medium text-gray-700">Name</th>
            <th className="py-3 px-6 text-sm font-medium text-gray-700">Role</th>
            <th className="py-3 px-6 text-sm font-medium text-gray-700">Department</th>
            <th className="py-3 px-6 text-sm font-medium text-gray-700">Status</th>
            <th className="py-3 px-6 text-sm font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.slice(0, 5).map((staffMember) => (
            <tr key={staffMember._id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-6 text-sm text-gray-800">
                {/* Check if profilePic exists, and provide a fallback image */}
                <img
                  src={
                    staffMember.profilePic
                      ? `http://localhost:5000/uploads/${staffMember.profilePic}`
                      : "/default-avatar.jpg"
                  }
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
              </td>
              <td className="py-3 px-6 text-sm text-gray-800">
                {staffMember.firstName} {staffMember.lastName}
              </td>
              <td className="py-3 px-6 text-sm text-gray-600">{staffMember.jobTitle}</td>
              <td className="py-3 px-6 text-sm text-gray-600">{staffMember.department}</td>
              <td className="py-3 px-6 text-sm text-gray-600">
                {renderStatusBadge(staffMember.status)}
              </td>
              <td className="py-3 px-6 text-sm text-gray-600">
                <button
                  onClick={() => handleDelete(staffMember._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>




      </div>
    </div>
  );
};

export default Dashboard;
