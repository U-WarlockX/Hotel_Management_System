import React, { useState, useEffect } from "react";

const StaffAttendance = () => {
  const [staff, setStaff] = useState([]);
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    fetch("http://localhost:5000/api/staff")
      .then((res) => res.json())
      .then((data) => {
        setStaff(data);
        let initialAttendance = {};
        data.forEach((member) => {
          initialAttendance[member._id] = member.status === "Active";
        });
        setAttendance(initialAttendance);
      });
  }, []);

  const handleAttendanceChange = (id) => {
    setAttendance((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const submitAttendance = () => {
    fetch("http://localhost:5000/api/staff/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(attendance),
    })
      .then((res) => res.json())
      .then(() => alert("Attendance updated successfully"));
  };

  return (
    <div>
      <div className="bg-white bg-opacity-30 backdrop-blur-lg p-6 rounded-lg shadow-xl border border-gray-200 w-full max-w-4xl">
      <h2 className="text-4xl font-semibold text-black mb-8 drop-shadow-md text-center">Mark Staff Attendance</h2>
        <table className="min-w-full table-auto text-left">
          <thead>
            <tr className="bg-gray-200 bg-opacity-70 border-b">
              <th className="py-3 px-6 text-sm font-medium text-black">Name</th>
              <th className="py-3 px-6 text-sm font-medium text-black">Job Title</th>
              <th className="py-3 px-6 text-sm font-medium text-black">Present</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((member) => (
              <tr key={member._id} className="border-b hover:bg-gray-50 transition duration-300 ease-in-out">
                <td className="py-3 px-6 text-sm text-black">{member.firstName} {member.lastName}</td>
                <td className="py-3 px-6 text-sm text-black">{member.jobTitle}</td>
                <td className="py-3 px-6 text-sm text-black">
                  <label className="inline-flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={attendance[member._id] || false}
                      onChange={() => handleAttendanceChange(member._id)}
                      className="h-6 w-6 text-blue-600 rounded-lg border-2 border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out transform hover:scale-110"
                    />
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={submitAttendance}
          className="mt-6 bg-green-800 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 transform hover:scale-105 transition duration-300 ease-in-out"
        >
          Upload Attendance
        </button>
      </div>
    </div>
  );
};

export default StaffAttendance;
