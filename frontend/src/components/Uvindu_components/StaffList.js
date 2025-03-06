import React, { useEffect, useState } from "react";
import axios from "axios";

const StaffList = () => {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/staff");
        setStaff(response.data);
      } catch (err) {
        console.error("Error fetching staff:", err);
      }
    };

    fetchStaff();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/staff/${id}`);
      setStaff(staff.filter((staffMember) => staffMember._id !== id));
    } catch (err) {
      console.error("Error deleting staff:", err);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Current Staff</h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full table-auto text-left">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-3 px-6 text-sm font-medium text-gray-700">Name</th>
              <th className="py-3 px-6 text-sm font-medium text-gray-700">Role</th>
              <th className="py-3 px-6 text-sm font-medium text-gray-700">Department</th>
              <th className="py-3 px-6 text-sm font-medium text-gray-700">Status</th>
              <th className="py-3 px-6 text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((staffMember) => (
              <tr key={staffMember._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-6 text-sm text-gray-800">{staffMember.firstName} {staffMember.lastName}</td>
                <td className="py-3 px-6 text-sm text-gray-600">{staffMember.jobTitle}</td>
                <td className="py-3 px-6 text-sm text-gray-600">{staffMember.department}</td>
                <td className="py-3 px-6 text-sm text-gray-600">{staffMember.status}</td>
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
  );
};

export default StaffList;
