import React, { useState } from "react";
import axios from "axios";

const AddStaff = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    jobTitle: "",
    shifts: {
      morning: false,
      afternoon: false,
      night: false,
    },
  });

  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const departments = {
    "Front Office": ["Front Desk Manager", "Receptionist", "Guest Service Agent", "Concierge", "Bellboy/Bellman", "Night Auditor", "Reservation Agent"],
    Housekeeping: ["Housekeeping Manager", "Room Attendant", "Housekeeping Supervisor", "Laundry Attendant", "Public Area Cleaner"],
    "Food & Beverage": ["F&B Manager", "Restaurant Manager", "Chef (Executive, Sous, etc.)", "Waiter/Waitress", "Bartender", "Kitchen Staff (Cook, Dishwasher, etc.)", "Banquet Coordinator", "Steward"],
    "Sales & Marketing": ["Sales Manager", "Marketing Manager", "Public Relations Manager", "Event Coordinator", "Digital Marketing Specialist"],
    Accounting: ["Finance Manager", "Accountant", "Payroll Coordinator", "Financial Analyst"],
    HR: ["HR Manager", "HR Assistant", "Recruitment Officer", "Training Coordinator", "Payroll Officer"],
    "Maintenance & Engineering": ["Maintenance Manager", "Engineer", "Electrician", "Plumber", "HVAC Technician"],
    Security: ["Security Manager", "Security Guard", "Surveillance Officer"],
    IT: ["IT Manager", "Network Administrator", "Systems Support Specialist", "IT Technician"],
    "Spa & Recreation": ["Spa Manager", "Spa Therapist", "Fitness Instructor", "Pool Attendant"],
    "Purchasing & Supply": ["Purchasing Manager", "Inventory Control Officer", "Procurement Specialist"],
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [type === "checkbox" ? "shifts" : name]: type === "checkbox" ? { ...prevData.shifts, [name]: checked } : value,
    }));
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "shifts") {
        Object.entries(value).forEach(([shift, isChecked]) => {
          formDataToSend.append(`shifts[${shift}]`, isChecked);
        });
      } else {
        formDataToSend.append(key, value);
      }
    });

    if (image) {
      formDataToSend.append("profilePic", image);
    }

    try {
      const response = await axios.post("http://localhost:5000/api/staff", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        setMessage("Staff member added successfully!");
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
      setMessage("Error adding staff. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h2 className="text-3xl font-semibold text-gray-700 mb-6">Add New Staff Member</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-6">
        {/* First Name & Last Name */}
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
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        {/* Department & Job Title */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700">Department:</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Department</option>
              {Object.keys(departments).map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700">Job Title:</label>
            <select
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              disabled={!formData.department}
            >
              <option value="">Select Job Title</option>
              {formData.department &&
                departments[formData.department].map((title) => (
                  <option key={title} value={title}>{title}</option>
                ))}
            </select>
          </div>
        </div>

        {/* Shifts */}
        <div>
          <label className="block text-gray-700">Shifts:</label>
          <div className="flex space-x-6">
            {["morning", "afternoon", "night"].map((shift) => (
              <label key={shift} className="flex items-center">
                <input
                  type="checkbox"
                  name={shift}
                  checked={formData.shifts[shift]}
                  onChange={handleChange}
                  className="mr-2 rounded"
                />
                {shift.charAt(0).toUpperCase() + shift.slice(1)}
              </label>
            ))}
          </div>
        </div>

        {/* Profile Picture */}
        <div>
          <label className="block text-gray-700">Profile Picture:</label>
          <input type="file" onChange={handleFileChange} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500">
          Add Staff
        </button>
      </form>

      {/* Message Display */}
      {message && <div className={`mt-6 p-4 rounded-md ${message.includes("success") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{message}</div>}
    </div>
  );
};

export default AddStaff;
