import React, { useEffect, useState } from "react";
import axios from "axios";

const StaffList = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // You can change this to show more or fewer items per page

  useEffect(() => {
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

  // Handle deleting a staff member
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff member?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/staff/${id}`);
      setStaff(staff.filter((staffMember) => staffMember._id !== id));
    } catch (err) {
      setError("Error deleting staff member");
      console.error(err);
    }
  };

  // Calculate the index range for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStaff = staff.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate the total number of pages
  const totalPages = Math.ceil(staff.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-8">
      <div className="w-full max-w-4xl flex flex-col justify-center">
        <h2 className="text-3xl font-semibold text-gray-700 mb-6 text-center">Current Staff Members</h2>

        {loading ? (
          <p className="text-center text-gray-600">Loading staff data...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200 mb-4">
            <table className="min-w-full table-auto text-left table-fixed">
              <thead>
                <tr className="bg-gray-100 border-b text-gray-700 text-sm">
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
                    <tr key={staffMember._id} className="border-b hover:bg-gray-50 text-gray-700">
                      <td className="py-3 px-6 text-sm">{indexOfFirstItem + index + 1}</td>
                      <td className="py-3 px-6 text-sm">
                        <div className="flex items-center justify-center">
                          {staffMember.profilePic ? (
                            <img
                              src={`http://localhost:5000/uploads/${staffMember.profilePic}`} // Ensure the correct URL path is used here
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
                      <td className="py-3 px-6 text-sm">
                        {staffMember.firstName} {staffMember.lastName}
                      </td>
                      <td className="py-3 px-6 text-sm">{staffMember.jobTitle}</td>
                      <td className="py-3 px-6 text-sm">{staffMember.department}</td>
                      <td className="py-3 px-6 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${staffMember.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                        >
                          {staffMember.status}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-sm">
                        <button
                          onClick={() => handleDelete(staffMember._id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:ring-2 focus:ring-red-500"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-4 text-center text-gray-600">
                      No staff members found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination controls */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
            className="bg-gray-200 text-gray-600 px-4 py-2 rounded-l-md"
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 ${currentPage === index + 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"} rounded-md mx-1`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
            className="bg-gray-200 text-gray-600 px-4 py-2 rounded-r-md"
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffList;
