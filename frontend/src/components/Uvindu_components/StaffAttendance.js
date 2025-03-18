import React, { useState, useEffect } from "react";

const StaffAttendance = () => {
  const [staff, setStaff] = useState([]);
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    fetch("http://localhost:5000/api/staff")
      .then(res => res.json())
      .then(data => {
        setStaff(data);
        let initialAttendance = {};
        data.forEach(member => {
          initialAttendance[member._id] = member.status === "Active";
        });
        setAttendance(initialAttendance);
      });
  }, []);

  const handleAttendanceChange = (id) => {
    setAttendance(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const submitAttendance = () => {
    fetch("http://localhost:5000/api/staff/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(attendance)
    })
      .then(res => res.json())
      .then(() => alert("Attendance updated successfully"));
  };

  return (
    <div>
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Mark Staff Attendance</h2>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full table-auto text-left">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-3 px-6 text-sm font-medium text-gray-700">Name</th>
              <th className="py-3 px-6 text-sm font-medium text-gray-700">Job Title</th>
              <th className="py-3 px-6 text-sm font-medium text-gray-700">Present</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((member) => (
              <tr key={member._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-6 text-sm text-gray-800">
                  {member.firstName} {member.lastName}
                </td>
                <td className="py-3 px-6 text-sm text-gray-600">{member.jobTitle}</td>
                <td className="py-3 px-6 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={attendance[member._id] || false}
                    onChange={() => handleAttendanceChange(member._id)}
                    className="h-5 w-5 text-blue-600"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={submitAttendance}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Upload Attendance
        </button>
      </div>
    </div>
  );
};

export default StaffAttendance;
