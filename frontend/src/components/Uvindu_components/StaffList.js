import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import StaffPopup from './StaffPopup'; 

const StaffList = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

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

  const handleUpdate = (id) => {
    navigate(`/staff/update/${id}`);
  };

  const handleView = (staffMember) => {
    setSelectedStaff(staffMember);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStaff = staff.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(staff.length / itemsPerPage);

  return (
    <div className="p-6 rounded-lg shadow-md border border-white/40 bg-white/30 backdrop-blur-md mt-6">
      <h2 className="text-lg font-semibold text-black mb-6">Current Staff</h2>

      {loading ? (
        <p className="text-center">Loading staff data...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left table-fixed">
            <thead>
              <tr className="border-b bg-gray-100 text-gray-700 text-sm">
                <th className="py-2 px-3 font-medium">#</th>
                <th className="py-2 px-3 font-medium">Profile</th>
                <th className="py-2 px-3 font-medium">Name</th>
                <th className="py-2 px-3 font-medium">Role</th>
                <th className="py-2 px-2 font-medium">Department</th>
                <th className="py-2 px-2 font-medium">Status</th>
                <th className="py-2 px-6 font-medium">Actions</th> {/* Increased px-6 for more spacing */}
              </tr>
            </thead>
            <tbody>
              {currentStaff.length > 0 ? (
                currentStaff.map((staffMember, index) => (
                  <tr key={staffMember._id} className="border-b hover:bg-gray-50 text-sm">
                    <td className="py-2 px-3">{indexOfFirstItem + index + 1}</td>
                    <td className="py-2 px-3">
                      <div className="flex items-center justify-center">
                        {staffMember.profilePic ? (
                          <img
                            src={`http://localhost:5000/uploads/${staffMember.profilePic}`}
                            alt="Profile"
                            className="w-8 h-8 rounded-full border border-gray-300 object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                            N/A
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-3">{staffMember.firstName} {staffMember.lastName}</td>
                    <td className="py-2 px-3">{staffMember.jobTitle}</td>
                    <td className="py-2 px-2">{staffMember.department}</td>
                    <td className="py-2 px-2">
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full font-semibold 
                        ${staffMember.status === "Active" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
                      >
                        {staffMember.status}
                      </span>
                    </td>
                    <td className="py-2 px-6"> {/* Increased spacing here */}
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleUpdate(staffMember._id)}
                          className="px-3 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDelete(staffMember._id)}
                          className="px-3 py-1 text-xs bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
                        >
                          Delete
                        </button>
                        <button 
                          onClick={() => handleView(staffMember)}
                          className="px-3 py-1 text-xs bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-4 text-center">No staff members found.</td>
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
          className="px-4 py-2 bg-blue-500 text-white rounded-md mx-1 hover:bg-blue-600 transition"
          disabled={currentPage === 1}
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-2 mx-1 rounded-md font-semibold transition 
              ${currentPage === index + 1 ? "bg-green-500 text-white" : "bg-gray-300 text-gray-800 hover:bg-gray-400"}`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md mx-1 hover:bg-blue-600 transition"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Popup */}
      <StaffPopup 
        selectedStaff={selectedStaff} 
        showPopup={showPopup} 
        handleClosePopup={handleClosePopup} 
      />
    </div>
  );
};

export default StaffList;
