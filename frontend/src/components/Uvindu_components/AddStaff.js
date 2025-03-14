import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Sun, SunDim, Moon } from "lucide-react"; // Icon Library

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
  const [message, setMessage] = useState("");

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
        setMessage("Staff member added successfully!");
        setFormData({ firstName: "", lastName: "", email: "", phone: "", department: "", jobTitle: "", shifts: { morning: false, afternoon: false, night: false } });
        setImage(null);
      }
    } catch (error) {
      setMessage("Error adding staff. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Add New Staff Member</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {["firstName", "lastName"].map((field) => (
            <div key={field}>
              <label className="block text-gray-700">{field.replace(/([A-Z])/g, " $1")}:</label>
              <input type="text" name={field} value={formData[field]} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
            </div>
          ))}
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {["email", "phone"].map((field) => (
            <div key={field}>
              <label className="block text-gray-700">{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
              <input type={field === "email" ? "email" : "text"} name={field} value={formData[field]} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
            </div>
          ))}
        </div>

        {/* Department & Job Title */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700">Department:</label>
            <select name="department" value={formData.department} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer">
              <option value="">Select Department</option>
              {Object.keys(departments).map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700">Job Title:</label>
            <select name="jobTitle" value={formData.jobTitle} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer" disabled={!formData.department}>
              <option value="">Select Job Title</option>
              {formData.department && departments[formData.department].map((title) => (
                <option key={title} value={title}>{title}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Shift Checkboxes with Animated Icons */}
        <div>
          <label className="block text-gray-700">Shifts:</label>
          <div className="flex space-x-6">
            {["morning", "afternoon", "night"].map((shift) => (
              <motion.label key={shift} className="shift-checkbox">
                <input type="checkbox" name={shift} checked={formData.shifts[shift]} onChange={handleChange} className="hidden peer" />
                
                <motion.div className="w-8 h-8 border-2 border-gray-400 rounded-md flex items-center justify-center"
                  animate={{ backgroundColor: formData.shifts[shift] ? "#2563EB" : "#ffffff", borderColor: formData.shifts[shift] ? "#1E3A8A" : "#9CA3AF" }} transition={{ duration: 0.3 }}>
                  
                  {formData.shifts[shift] && (
                    <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                      {shift === "morning" ? <Sun className="text-yellow-500 w-6 h-6" /> : shift === "afternoon" ? <SunDim className="text-orange-500 w-6 h-6" /> : <Moon className="text-indigo-500 w-6 h-6" />}
                    </motion.div>
                  )}
                </motion.div>

                <span className="text-gray-700">{shift.charAt(0).toUpperCase() + shift.slice(1)}</span>
              </motion.label>
            ))}
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-gray-700">Profile Picture:</label>
          <input type="file" onChange={handleFileChange} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer" />
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 transform hover:scale-105">Add Staff</button>
      </form>
    </div>
  );
};

export default AddStaff;
