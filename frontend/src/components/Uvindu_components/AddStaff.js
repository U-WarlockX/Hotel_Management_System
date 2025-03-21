import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sun, SunDim, Moon } from "lucide-react"; 
import axios from "axios";

const AddStaff = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    jobTitle: "",
    shifts: { morning: false, afternoon: false, night: false },
  });

  const [image, setImage] = useState(null);

  const [isDepartmentOpen, setIsDepartmentOpen] = useState(false);
  const [isJobTitleOpen, setIsJobTitleOpen] = useState(false);

  const departments = {
    "Front Office": ["Receptionist", "Guest Service Agent", "Concierge"],
    Housekeeping: ["Housekeeping Manager", "Room Attendant"],
    "Food & Beverage": ["F&B Manager", "Chef", "Waiter", "Bartender"],
    Security: ["Security Manager", "Security Guard"],
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [type === "checkbox" ? "shifts" : name]: type === "checkbox" ? { ...prev.shifts, [name]: checked } : value,
    }));
  };

  const handleFileChange = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "shifts") {
        Object.entries(value).forEach(([shift, isChecked]) => formDataToSend.append(`shifts[${shift}]`, isChecked));
      } else {
        formDataToSend.append(key, value);
      }
    });

    if (image) formDataToSend.append("profilePic", image);

    try {
      const response = await axios.post("http://localhost:5000/api/staff", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          department: "",
          jobTitle: "",
          shifts: { morning: false, afternoon: false, night: false },
        });
        setImage(null);
      }
    } catch (error) {
      console.error("Error adding staff:", error);
    }
  };

  return (
    <div>
      <motion.div className="bg-white bg-opacity-30 backdrop-blur-lg p-6 rounded-lg shadow-xl border border-gray-200 w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Add New Staff Member</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {["firstName", "lastName"].map((field) => (
              <div key={field}>
                <label className="block text-gray-700">{field.replace(/([A-Z])/g, " $1")}:</label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white hover:shadow-lg transition-all duration-300"
                />
              </div>
            ))}
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {["email", "phone"].map((field) => (
              <div key={field}>
                <label className="block text-gray-700">{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white hover:shadow-lg transition-all duration-300"
                />
              </div>
            ))}
          </div>

          {/* Department & Job Title - Custom Dropdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Department Dropdown */}
            <div>
              <label className="block text-gray-700">Department:</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDepartmentOpen(!isDepartmentOpen)}
                  className="w-full p-4 border border-gray-300 rounded-lg text-left focus:ring-2 focus:ring-blue-500 bg-white hover:shadow-lg transition-all duration-300"
                >
                  {formData.department || "Select Department"}
                </button>
                {isDepartmentOpen && (
                  <div className="absolute left-0 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
                    {Object.keys(departments).map((dept) => (
                      <button
                        key={dept}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, department: dept, jobTitle: "" });
                          setIsDepartmentOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-blue-100"
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Job Title Dropdown */}
            <div>
              <label className="block text-gray-700">Job Title:</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsJobTitleOpen(!isJobTitleOpen)}
                  className="w-full p-4 border border-gray-300 rounded-lg text-left focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer hover:shadow-lg transition-all duration-300"
                  disabled={!formData.department}
                >
                  {formData.jobTitle || "Select Job Title"}
                </button>
                {isJobTitleOpen && formData.department && (
                  <div className="absolute left-0 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
                    {departments[formData.department].map((title) => (
                      <button
                        key={title}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, jobTitle: title });
                          setIsJobTitleOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-blue-100"
                      >
                        {title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Shift Checkboxes with Animated Icons */}
          <div>
            <label className="block text-gray-700">Shifts:</label>
            <div className="flex space-x-6">
              {["morning", "afternoon", "night"].map((shift) => (
                <motion.label key={shift} className="shift-checkbox">
                  <input
                    type="checkbox"
                    name={shift}
                    checked={formData.shifts[shift]}
                    onChange={handleChange}
                    className="hidden peer"
                  />
                  <motion.div
                    className="w-12 h-12 border-2 border-gray-400 rounded-md flex items-center justify-center"
                    animate={{
                      backgroundColor: formData.shifts[shift] ? "#2563EB" : "#ffffff",
                      borderColor: formData.shifts[shift] ? "#1E3A8A" : "#9CA3AF",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {formData.shifts[shift] && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {shift === "morning" ? (
                          <Sun className="text-yellow-500 w-6 h-6" />
                        ) : shift === "afternoon" ? (
                          <SunDim className="text-orange-500 w-6 h-6" />
                        ) : (
                          <Moon className="text-indigo-500 w-6 h-6" />
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                  <span className="text-gray-700">{shift.charAt(0).toUpperCase() + shift.slice(1)}</span>
                </motion.label>
              ))}
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <label className="block text-gray-700">Profile Picture:</label>
            <div className="flex items-center space-x-4">
              <label
                htmlFor="file-upload"
                className="cursor-pointer px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
              >
                Upload Profile Picture
              </label>
              <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Display Image with Blur Effect */}
            {image && (
              <div>
                <img
                  src={URL.createObjectURL(image)}
                  alt={image.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            Add Staff
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddStaff;
