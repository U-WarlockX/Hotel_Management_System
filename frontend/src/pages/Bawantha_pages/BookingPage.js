// BookingPage.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Header from "../../components/Bawantha_components/Header";
import Sidebar from "../../components/Bawantha_components/Sidebar";

import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookingPage = () => {
  const { roomNumber } = useParams();
  const navigate = useNavigate();
  const [roomDetails, setRoomDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    nic: "",
    phone: "",
    gender: "Male",
    checkInDate: "",
    checkOutDate: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/rooms/summary")
      .then((response) => {
        if (response.data.success) {
          const room = response.data.data.find(
            (r) => r.roomNumber === roomNumber
          );
          setRoomDetails(room || null);
        } else {
          setRoomDetails(null);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching room summary:", error);
        setRoomDetails(null);
        setLoading(false);
      });
  }, [roomNumber]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate form before submitting
  const validateForm = () => {
    let errors = {};
    if (!formData.firstName.trim()) errors.firstName = "First Name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last Name is required";
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    if (!formData.nic.trim()) errors.nic = "NIC is required";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (!formData.checkInDate) errors.checkInDate = "Check-in Date is required";
    if (!formData.checkOutDate)
      errors.checkOutDate = "Check-out Date is required";

    if (formData.checkInDate && formData.checkOutDate) {
      const checkIn = new Date(formData.checkInDate);
      const checkOut = new Date(formData.checkOutDate);
      if (checkIn >= checkOut) {
        errors.checkOutDate = "Check-out Date must be after Check-in Date";
      }
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Show Confirmation Modal
  const handleBookNow = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setShowConfirmation(true);
  };

  // Confirm Booking
  const handleConfirmBooking = async () => {
    try {
      setShowConfirmation(false);

      const bookingData = {
        roomNumber: roomDetails.roomNumber,
        roomType: roomDetails.roomType,
        price: roomDetails.price,
        image: roomDetails.images[0],
        customerName: `${formData.firstName} ${formData.lastName}`,
        nic: formData.nic,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
      };

      // 1) Save Booking
      await axios.post("http://localhost:5000/api/bookings", bookingData);

      // 2) Mark the Room as Booked
      await axios.put(
        `http://localhost:5000/api/rooms/${roomDetails.roomNumber}/book`,
        { availability: false }
      );

      // 3) Refresh Available Rooms
      await axios.get("http://localhost:5000/api/rooms/available");

      toast.success("Booking Confirmed! ✅ Redirecting...");

      // 4) Redirect
      setTimeout(() => {
        navigate("/booked-rooms");
      }, 1500);
    } catch (error) {
      console.error("❌ Error confirming booking:", error);
      toast.error("Booking failed. Please try again.");
    }
  };

  return (
    <>
   <Header />
      {/* ✅ Background Image with Blur Effect */}
      <div
        className="flex min-h-screen bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: `url('https://i1.wp.com/hotel-latour.co.uk/app/app-uploads/2021/11/HLT_reception_Lifestyle1_2500-min.jpg?ssl=1&w=2500&quality=85')`,
        }}
      >
        {/* ✅ Blur Overlay */}
        <div className="absolute inset-0 backdrop-blur-md bg-black bg-opacity-10"></div>

        <Sidebar />
        <div className="flex-1 p-6 relative z-10">
      
      {loading ? (
        <p className="p-6 bg-gray-100 min-h-screen">Loading room details...</p>
      ) : roomDetails ? (
       <div className="p-14 min-h-screen bg-transparent">
          {/* Room Details Container using background image */}
          <div
            className="relative w-3/4 h-60 shadow-sm rounded-lg overflow-hidden mb-6 mx-auto flex items-center justify-between p-10 bg-white"
            style={{
              backgroundImage: `url(${roomDetails.images[0]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Semi-transparent overlay to make text readable */}
            <div className="absolute inset-0 bg-black bg-opacity-30" />

            {/* Text content (on top of overlay) */}
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center text-center text-white">
                  <h2 className="text-3xl font-bold">{roomDetails.roomType} - Room {roomDetails.roomNumber}</h2>
                  <p className="text-lg">Rs. {roomDetails.price} per night</p>
                </div>
          </div>

          {/* Customer Details Form */}
          <div className="bg-white/40 p-6 shadow-lg rounded-lg w-3/4 backdrop-blur-md mx-auto flex flex-col items-center">

            <h2 className="text-2xl  font-semibold mb-14 text-center">
              Add Customer Details
            </h2>
            <form onSubmit={handleBookNow} className="grid grid-cols-2 gap-x-24 gap-y-9">
            {/* First Name */}
    <div>
      <label className="block text-gray-1000 font-medium mb-1 ">First Name</label>
      <input
        type="text"
        name="firstName"
        placeholder="Enter First Name"
        value={formData.firstName}
        onChange={handleChange}
        className="border p-1 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
      />
      {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
    </div>
            
              {/* Last Name */}
    <div>
      <label className="block text-gray-1000 font-medium mb-1">Last Name</label>
      <input
        type="text"
        name="lastName"
        placeholder="Enter Last Name"
        value={formData.lastName}
        onChange={handleChange}
        className="border p-1 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
      />
      {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
    </div>
            
              {/* Email */}
    <div>
      <label className="block text-gray-1000 font-medium mb-1">Email</label>
      <input
        type="email"
        name="email"
        placeholder="Enter Email"
        value={formData.email}
        onChange={handleChange}
        className="border p-1 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
      />
      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
    </div>
              {/* NIC */}
    <div>
      <label className="block text-gray-1000 font-medium mb-1">NIC</label>
      <input
        type="text"
        name="nic"
        placeholder="Enter NIC"
        value={formData.nic}
        onChange={handleChange}
        className="border p-1 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
      />
      {errors.nic && <p className="text-red-500 text-sm mt-1">{errors.nic}</p>}
    </div>
              {/* Phone */}
    <div>
      <label className="block text-gray-1000 font-medium mb-1">Phone</label>
      <input
        type="text"
        name="phone"
        placeholder="Enter Phone Number"
        value={formData.phone}
        onChange={handleChange}
        className="border p-1 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
      />
      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
    </div>
            
    {/* Gender */}
    <div>
      <label className="block text-gray-1000 font-medium mb-1">Gender</label>
      <select
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        className="border p-1 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
      >
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
    </div>

               {/* Check-In Date */}
    <div>
      <label className="block text-gray-1000 font-medium mb-1">Check-In</label>
      <input
        type="date"
        name="checkInDate"
        value={formData.checkInDate}
        onChange={handleChange}
        className="border p-1 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
      />
      {errors.checkInDate && <p className="text-red-500 text-sm mt-1">{errors.checkInDate}</p>}
    </div>
               {/* Check-Out Date */}
    <div>
      <label className="block text-gray-1000 font-medium mb-1">Check-Out</label>
      <input
        type="date"
        name="checkOutDate"
        value={formData.checkOutDate}
        onChange={handleChange}
        className="border p-1 rounded-lg w-full focus:ring-2 focus:ring-blue-400 "
      />
      {errors.checkOutDate && <p className="text-red-500 text-sm mt-1">{errors.checkOutDate}</p>}
    </div>

              {/* Buttons */}
              <div className="col-span-2 flex justify-between mt-4">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Book Now
                </button>
              </div>
              {/* Confirmation Popup */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 transform transition-all">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Confirm Booking</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to book this Room? 
            </p>
            <div className="flex flex-row-reverse gap-4">
              <button
                onClick={handleConfirmBooking}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                Yes, Book Now
              </button>
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

              {/* Confirmation Modal
              {showConfirmation && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
                  <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <p className="text-lg font-semibold mb-4">
                      Confirm Booking?
                    </p>
                    <button
                      onClick={handleConfirmBooking}
                      className="bg-green-500 text-white px-4 py-2 rounded-md mr-4 hover:bg-green-600"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setShowConfirmation(false)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )} */}
            </form>
          </div>
        </div>
      ) : (
        <p className="p-6 bg-gray-100 min-h-screen text-red-500">
          Room not found.
        </p>
      )}
      </div>
      </div>
      </>
    
  );
};

export default BookingPage;
