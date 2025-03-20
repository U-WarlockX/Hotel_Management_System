import React, { useState, useEffect } from "react";
import axios from "axios";

// Components
import Header from "../../components/Bawantha_components/Header";
import Sidebar from "../../components/Bawantha_components/Sidebar";
import ReservationHistoryTable from "../../components/Bawantha_components/ReservationHistoryTable";

/**
 * Inline Background Slideshow (same style as BookedRooms)
 */
const BackgroundSlideshow = () => {
  const images = [
    "https://expressinnindia.com/wp-content/uploads/2024/07/Freesia-God-23.jpg",
    "https://expressinnindia.com/wp-content/uploads/2024/07/Freesia-God-20.jpg",
    "https://expressinnindia.com/wp-content/uploads/2022/08/JR.-SUITE-BOISAR-1-scaled.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {images.map((url, index) => (
        <div
          key={url}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-80" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${url})` }}
        />
      ))}
    </div>
  );
};

const ReservationHistory = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/bookings")
      .then((response) => {
        // Sort reservations by MongoDB _id to show the last booked record first
        const sortedData = response.data.data.sort(
          (a, b) => b._id.localeCompare(a._id) // Newest bookings first
        );
        setReservations(sortedData);
        setFilteredReservations(sortedData);
      })
      .catch((error) => console.error("Error fetching reservations:", error));
  }, []);
  

  // Filter reservations by date range
  const filterByDate = () => {
    if (startDate && endDate) {
      const filtered = reservations.filter((reservation) => {
        const bookedDate = new Date(reservation.bookedDate);
        return bookedDate >= new Date(startDate) && bookedDate <= new Date(endDate);
      });
      setFilteredReservations(filtered);
    }
  };

  // Function to generate and download report
  const generateReport = () => {
    if (filteredReservations.length === 0) {
      alert("No reservation records available to export.");
      return;
    }

    const csvHeader = ["Booking ID", "Room Number", "Customer Name", "NIC", "Phone", "Booked Date"];
    const csvRows = filteredReservations.map((reservation) => [
      reservation._id, // Booking ID from MongoDB
      reservation.roomNumber,
      reservation.customerName,
      reservation.nic,
      reservation.phone,
      reservation.checkInDate, // Format date
    ]);

    const csvContent = [csvHeader, ...csvRows].map((row) => row.join(",")).join("\n");

    // Create a Blob and generate a download link
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Reservation_History_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* Header at the top */}
      <Header />

      {/* Main container with background slideshow and sidebar */}
      <div className="flex min-h-screen relative">
        <BackgroundSlideshow />
        <Sidebar />

        {/* Right side content */}
        <div className="flex-1 text-sm pt-20 pl-4 pr-12 relative z-10">
          {/* <h1 className="text-2xl font-bold text-white mb-4">Reservation History</h1> */}

          {/* Filter Section */}
          <div className="bg-white/80 backdrop-blur-md p-4 shadow-md rounded-lg flex flex-wrap items-center justify-between mb-5">
            <input
              type="text"
              placeholder="Search for a booking..."
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300 w-1/4"
            />
            <div className="flex space-x-4">
              <div>
                <label className="block text-gray-600 text-sm">From:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm">To:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md"
                />
              </div>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition mt-6"
                onClick={filterByDate}
              >
                Search
              </button>
            </div>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
              onClick={generateReport}
            >
              Report 📄
            </button>
          </div>

          {/* Reservation Table */}
          <div className="bg-white/95 p-5 shadow-md rounded-lg">
            <ReservationHistoryTable reservations={filteredReservations} />
          </div>

          {/* Back Button */}
          <button
            className="mt-5 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
            onClick={() => window.history.back()}
          >
            Back
          </button>
        </div>
      </div>
    </>
  );
};

export default ReservationHistory;
