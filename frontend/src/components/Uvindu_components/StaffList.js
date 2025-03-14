import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSun, FaMoon } from "react-icons/fa"; // Import icons for the toggle

const StaffList = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  // Theme State
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    // Fetch Staff Data
    const fetchStaff = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/staff");
        setStaff(response.data);
      } catch (err) {
        setError("Error fetching staff data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  // Toggle Dark Mode
  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  // Delete Staff Member
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff member?"))
      return;
    try {
      await axios.delete(`http://localhost:5000/api/staff/${id}`);
      setStaff(staff.filter((staffMember) => staffMember._id !== id));
    } catch (err) {
      setError("Error deleting staff member");
      console.error(err);
    }
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStaff = staff.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(staff.length / itemsPerPage);

  return (
    <div>

      {/* Staff Table */}
      <div className={`relative p-6 ${darkMode ? "bg-gray-800 bg-opacity-80" : "bg-white bg-opacity-70"} rounded-lg shadow-md border border-gray-200 max-w-6xl mx-auto`}>
        <h2 className="text-3xl font-semibold text-center mb-6">
          Current Staff Members
        </h2>

        {loading ? (
          <p className="text-center">Loading staff data...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left table-fixed">
              <thead>
                <tr className={`border-b ${darkMode ? "bg-gray-700 text-white" : "bg-blue-100 text-gray-700"} text-sm`}>
                  <th className="py-3 px-6 font-medium">#</th>
                  <th className="py-3 px-6 font-medium">Profile Pic</th>
                  <th className="py-3 px-6 font-medium">Name</th>
                  <th className="py-3 px-6 font-medium">Role</th>
                  <th className="py-3 px-6 font-medium">Department</th>
                  <th className="py-3 px-6 font-medium">Status</th>
                  <th className="py-3 px-6 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentStaff.length > 0 ? (
                  currentStaff.map((staffMember, index) => (
                    <tr key={staffMember._id} className={`border-b hover:bg-gray-100 ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"} text-sm`}>
                      <td className="py-3 px-6">{indexOfFirstItem + index + 1}</td>
                      <td className="py-3 px-6">
                        <div className="flex items-center justify-center">
                          {staffMember.profilePic ? (
                            <img
                              src={`http://localhost:5000/uploads/${staffMember.profilePic}`}
                              alt="Profile"
                              className="w-10 h-10 rounded-full border border-gray-300 object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                              N/A
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-6">{staffMember.firstName} {staffMember.lastName}</td>
                      <td className="py-3 px-6">{staffMember.jobTitle}</td>
                      <td className="py-3 px-6">{staffMember.department}</td>
                      <td className="py-3 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${staffMember.status === "Active" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
                        >
                          {staffMember.status}
                        </span>
                      </td>
                      <td className="py-3 px-6">
                        <button
                          onClick={() => handleDelete(staffMember._id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-4 text-center">
                      No staff members found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
            className="px-6 py-3 bg-blue-500 text-white rounded-md mx-2 hover:bg-blue-600 transition"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-6 py-3 mx-1 rounded-md font-semibold transition ${currentPage === index + 1 ? "bg-green-500 text-white" : "bg-gray-300 text-gray-800 hover:bg-gray-400"}`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
            className="px-6 py-3 bg-blue-500 text-white rounded-md mx-2 hover:bg-blue-600 transition"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffList;
