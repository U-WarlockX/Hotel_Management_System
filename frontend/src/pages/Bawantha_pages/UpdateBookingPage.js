import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaUser, FaIdCard, FaEnvelope, FaPhone, FaCalendarCheck, FaVenusMars } from "react-icons/fa";

import Header from "../../components/Bawantha_components/Header";
import Sidebar from "../../components/Bawantha_components/Sidebar";

const UpdateBookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    nic: "",
    email: "",
    phone: "",
    gender: "Male",
    checkInDate: "",
    checkOutDate: "",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/bookings/${id}`)
      .then((response) => {
        setBooking(response.data.data);
        setFormData(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching booking:", error);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateBooking = async () => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/${id}`, formData);
      toast.success("Booking updated successfully!");
      setShowConfirmPopup(false);
      navigate(-1); // Go back to previous page
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error("Failed to update booking!");
      setShowConfirmPopup(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmPopup(true);
  };

  return (
    <>
      <Header />
      <div
        className="flex min-h-screen bg-cover bg-center bg-no-repeat relative "
        style={{
          backgroundImage: `url('https://i1.wp.com/hotel-latour.co.uk/app/app-uploads/2021/11/HLT_reception_Lifestyle1_2500-min.jpg?ssl=1&w=2500&quality=85')`,
        }}
      >
        
        {/* Blur Overlay */}
        <div className="absolute inset-0 backdrop-blur-md bg-black bg-opacity-20"></div>

        <Sidebar />
        <div className="flex-1 p-14 relative z-10 flex justify-center">
          {loading ? (
            <p className="p-6 text-white text-xl font-semibold">Loading booking details...</p>
          ) : booking ? (
            <div className="p-10 bg-white/20 shadow-xl rounded-lg w-3/4 backdrop-blur-md border border-white border-opacity-30 mt-8">
              {/* Room Image Header */}
              <div className="relative w-full h-72 rounded-lg overflow-hidden shadow-lg bg-gray-800 flex items-center justify-center">
                {/* Background Image */}
                <div
                  className="absolute inset-0 w-full h-full"
                  style={{
                    backgroundImage: `url(${booking.image || "https://source.unsplash.com/800x600/?hotel-room"})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>

                {/* Dark Overlay for Readability */}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white">
                  <h2 className="text-3xl font-bold">{booking.roomType} - Room {booking.roomNumber}</h2>
                  <p className="text-lg">Rs. {booking.price} per night</p>
                </div>
              </div>

              {/* Update Form Section */}
              <div className="relative bg-white/60 backdrop-blur-md rounded-lg shadow-lg p-10 mt-8">
                <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">Update Booking Details</h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-20 gap-y-8 text-gray-800">
                  {/* Customer Name */}
                  <div className="flex items-center space-x-3">
                    <FaUser className="text-blue-700 text-xl" />
                    <div className="w-full">
                      <label className="block text-gray-700 font-semibold">Customer Name</label>
                      <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        className="w-full border p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                  </div>

                  {/* NIC */}
                  <div className="flex items-center space-x-3">
                    <FaIdCard className="text-blue-700 text-xl" />
                    <div className="w-full">
                      <label className="block text-gray-700 font-semibold">NIC</label>
                      <input
                        type="text"
                        name="nic"
                        value={formData.nic}
                        onChange={handleChange}
                        className="w-full border p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center space-x-3">
                    <FaEnvelope className="text-blue-700 text-xl" />
                    <div className="w-full">
                      <label className="block text-gray-700 font-semibold">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center space-x-3">
                    <FaPhone className="text-blue-700 text-xl" />
                    <div className="w-full">
                      <label className="block text-gray-700 font-semibold">Phone</label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="flex items-center space-x-3">
                    <FaVenusMars className="text-blue-700 text-xl" />
                    <div className="w-full">
                      <label className="block text-gray-700 font-semibold">Gender</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full border p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>

                  {/* Check-In Date */}
                  <div className="flex items-center space-x-3">
                    <FaCalendarCheck className="text-blue-700 text-xl" />
                    <div className="w-full">
                      <label className="block text-gray-700 font-semibold">Check-In Date</label>
                      <input
                        type="date"
                        name="checkInDate"
                        value={formData.checkInDate}
                        onChange={handleChange}
                        className="w-full border p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="col-span-2 flex justify-between w-full mt-12 pt-6 ">
                    {/* Cancel Button - Aligned to Left */}
                    <button
                      type="button"
                      className="px-5 py-2 rounded-md bg-gray-500 text-white shadow-md hover:bg-gray-600 transition"
                      onClick={() => navigate(-1)}
                    >
                      Cancel
                    </button>

                    {/* Update Button - Aligned to Right */}
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-md bg-yellow-500 text-white shadow-md hover:bg-yellow-600 transition"
                    >
                      Confirm
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <p className="p-6 text-white text-xl text-center">Booking not found.</p>
          )}
        </div>
      </div>
      
      {/* Confirmation Popup */}
      {showConfirmPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 transform transition-all">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Confirm Booking Update</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to update this booking? 
            </p>
            <div className="flex flex-row-reverse gap-4">
              <button
                onClick={handleUpdateBooking}
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
              >
                Yes, Update Booking
              </button>
              <button
                onClick={() => setShowConfirmPopup(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateBookingPage;