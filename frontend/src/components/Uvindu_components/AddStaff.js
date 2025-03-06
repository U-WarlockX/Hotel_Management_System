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
    profilePic: "", // Add profilePic field
  });

  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null); // To store the selected image file

  const departments = {
    "Front Office": [
      "Front Desk Manager",
      "Receptionist",
      "Guest Service Agent",
      "Concierge",
      "Bellboy/Bellman",
      "Night Auditor",
      "Reservation Agent",
    ],
    Housekeeping: [
      "Housekeeping Manager",
      "Room Attendant",
      "Housekeeping Supervisor",
      "Laundry Attendant",
      "Public Area Cleaner",
    ],
    "Food & Beverage": [
      "F&B Manager",
      "Restaurant Manager",
      "Chef (Executive, Sous, etc.)",
      "Waiter/Waitress",
      "Bartender",
      "Kitchen Staff (Cook, Dishwasher, etc.)",
      "Banquet Coordinator",
      "Steward",
    ],
    "Sales & Marketing": [
      "Sales Manager",
      "Marketing Manager",
      "Public Relations Manager",
      "Event Coordinator",
      "Digital Marketing Specialist",
    ],
    Accounting: [
      "Finance Manager",
      "Accountant",
      "Payroll Coordinator",
      "Financial Analyst",
    ],
    HR: [
      "HR Manager",
      "HR Assistant",
      "Recruitment Officer",
      "Training Coordinator",
      "Payroll Officer",
    ],
    "Maintenance & Engineering": [
      "Maintenance Manager",
      "Engineer",
      "Electrician",
      "Plumber",
      "HVAC Technician",
    ],
    Security: ["Security Manager", "Security Guard", "Surveillance Officer"],
    IT: ["IT Manager", "Network Administrator", "Systems Support Specialist", "IT Technician"],
    "Spa & Recreation": ["Spa Manager", "Spa Therapist", "Fitness Instructor", "Pool Attendant"],
    "Purchasing & Supply": ["Purchasing Manager", "Inventory Control Officer", "Procurement Specialist"],
  };

  // Handle form data change
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        shifts: {
          ...prevData.shifts,
          [name]: checked, // Update the respective shift based on checkbox
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value, // Handle other form inputs
      }));
    }
  };

  // Handle file change (for profile picture)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file); // Save the selected file to the state
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...formData,
      shifts: {
        morning: formData.shifts.morning,
        afternoon: formData.shifts.afternoon,
        night: formData.shifts.night,
      },
    };

    try {
      let imageUrl = "";

      if (image) {
        // Create FormData object to send the image to the server
        const formDataImage = new FormData();
        formDataImage.append("profilePic", image);

        // Upload the image to the server (replace with your own API endpoint for image upload)
        const uploadResponse = await axios.post("http://localhost:5000/api/upload", formDataImage, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        // Get the URL of the uploaded image (assuming the server returns the image URL)
        imageUrl = uploadResponse.data.imageUrl; // Modify this based on your server's response
      }

      // Add image URL to form data before submitting
      const finalDataToSend = { ...dataToSend, profilePic: imageUrl };

      // Send the staff data to the server
      const response = await axios.post("http://localhost:5000/api/staff", finalDataToSend);
      if (response.status === 201) {
        setMessage("Staff member added successfully!");
        // Optionally, reset the form after submission
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          department: "",
          jobTitle: "",
          shifts: { morning: false, afternoon: false, night: false },
          profilePic: "",
        });
        setImage(null); // Reset the selected image
      }
    } catch (err) {
      setMessage("Error adding staff. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h2 className="text-3xl font-semibold text-gray-700 mb-6">Add New Staff Member</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700">First Name:</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700">Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700">Phone:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700">Department:</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Department</option>
              {Object.keys(departments).map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
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
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!formData.department}
            >
              <option value="">Select Job Title</option>
              {formData.department &&
                departments[formData.department].map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-gray-700">Shifts:</label>
          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="morning"
                checked={formData.shifts.morning}
                onChange={handleChange}
                className="mr-2 rounded"
              />
              Morning
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="afternoon"
                checked={formData.shifts.afternoon}
                onChange={handleChange}
                className="mr-2 rounded"
              />
              Afternoon
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="night"
                checked={formData.shifts.night}
                onChange={handleChange}
                className="mr-2 rounded"
              />
              Night
            </label>
          </div>
        </div>

        <div>
          <label className="block text-gray-700">Profile Picture:</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Staff
        </button>
      </form>

      {message && (
        <div
          className={`mt-6 p-4 rounded-md ${
            message.includes("success") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default AddStaff;
