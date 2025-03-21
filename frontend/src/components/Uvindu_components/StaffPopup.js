import React from 'react';

const StaffPopup = ({ selectedStaff, showPopup, handleClosePopup }) => {
  if (!showPopup || !selectedStaff) return null;

  // Determine the shift type
  const shiftType = selectedStaff.shiftType || "Not Available";

  // Helper function to get a human-readable shift type
  const getShiftTypeLabel = (shift) => {
    switch (shift) {
      case 'morning':
        return 'Morning Shift';
      case 'afternoon':
        return 'Afternoon Shift';
      case 'night':
        return 'Night Shift';
      default:
        return 'Shift Not Assigned';
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full sm:w-96 max-w-lg animate__animated animate__fadeIn animate__delay-1s">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Staff Details</h2>

        <div className="flex justify-center mb-6">
          {selectedStaff.profilePic ? (
            <img
              src={`http://localhost:5000/uploads/${selectedStaff.profilePic}`}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xl">
              N/A
            </div>
          )}
        </div>

        <div className="space-y-4 text-gray-700">
          <div className="flex justify-between">
            <p><strong>Name:</strong> {selectedStaff.firstName} {selectedStaff.lastName}</p>
          </div>
          <div className="flex justify-between">
            <p><strong>Role:</strong> {selectedStaff.jobTitle}</p>
          </div>
          <div className="flex justify-between">
            <p><strong>Department:</strong> {selectedStaff.department}</p>
          </div>
          <div className="flex justify-between">
            <p><strong>Status:</strong> <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${selectedStaff.status === "Active" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>{selectedStaff.status}</span></p>
          </div>
          <div className="flex justify-between">
            <p><strong>Email:</strong> {selectedStaff.email}</p>
          </div>
          <div className="flex justify-between">
            <p><strong>Phone:</strong> {selectedStaff.phone}</p>
          </div>

          {/* Shift Details */}
          <div className="bg-gray-100 p-4 rounded-lg mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Shift Details</h3>
            <p><strong>Shift:</strong> {getShiftTypeLabel(shiftType)}</p>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={handleClosePopup}
            className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffPopup;
