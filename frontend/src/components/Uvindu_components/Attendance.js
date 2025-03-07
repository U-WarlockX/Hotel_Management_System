import React, { useState, useEffect } from "react";
import axios from "axios";

const Attendance = () => {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/staff");
        setStaff(response.data);
      } catch (err) {
        console.error("Error fetching staff data:", err);
      }
    };
    fetchStaff();
  }, []);

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    try {
      await axios.patch(`http://localhost:5000/api/staff/${id}`, { status: newStatus });
      setStaff(staff.map((member) =>
        member._id === id ? { ...member, status: newStatus } : member
      ));
    } catch (err) {
      console.error("Error updating staff status:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Attendance</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-left">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-3 px-6 text-sm font-medium text-gray-700">ID</th>
              <th className="py-3 px-6 text-sm font-medium text-gray-700">Name</th>
              <th className="py-3 px-6 text-sm font-medium text-gray-700">Department</th>
              <th className="py-3 px-6 text-sm font-medium text-gray-700">Active</th>
              <th className="py-3 px-6 text-sm font-medium text-gray-700">Inactive</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((staffMember) => (
              <tr key={staffMember._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-6 text-sm text-gray-800">{staffMember._id}</td>
                <td className="py-3 px-6 text-sm text-gray-800">
                  {staffMember.firstName} {staffMember.lastName}
                </td>
                <td className="py-3 px-6 text-sm text-gray-600">{staffMember.department}</td>
                <td className="py-3 px-6 text-sm text-gray-600">
                  {staffMember.status === "Active" ? (
                    <button
                      onClick={() => handleStatusChange(staffMember._id, staffMember.status)}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      Active
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusChange(staffMember._id, staffMember.status)}
                      className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Inactive
                    </button>
                  )}
                </td>
                <td className="py-3 px-6 text-sm text-gray-600">
                  {staffMember.status === "Inactive" ? (
                    <button
                      onClick={() => handleStatusChange(staffMember._id, staffMember.status)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Inactive
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusChange(staffMember._id, staffMember.status)}
                      className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Active
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
