// BookedRooms.js
import React, { useState, useEffect } from "react";
import axios from "axios";

// Components (no Layout)
import Header from "../../components/Bawantha_components/Header";
import Sidebar from "../../components/Bawantha_components/Sidebar";

// Custom filter just for BookedRooms
import BookedRoomsFilter from "../../components/Bawantha_components/BookedRoomsFilter";

import BookedRoomsTable from "../../components/Bawantha_components/BookedRoomsTable";
import RoomGrid from "../../components/Bawantha_components/RoomGrid";

/**
 * Inline Background Slideshow (same style as AvailableRooms)
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
          className={`
            absolute inset-0
            bg-cover bg-center bg-no-repeat
            transition-opacity duration-1000 ease-in-out
            ${index === currentIndex ? "opacity-80" : "opacity-0"}
          `}
          style={{ backgroundImage: `url(${url})` }}
        />
      ))}
    </div>
  );
};

const BookedRooms = () => {
  const [bookedRooms, setBookedRooms] = useState([]);
  const [originalData, setOriginalData] = useState([]); 
  // ^ Keep a copy of the original data for re-filtering

  // Fetch booked rooms from API
  const fetchBookedRooms = () => {
    axios
      .get("http://localhost:5000/api/bookings")
      .then((response) => {
        setBookedRooms(response.data.data);
        setOriginalData(response.data.data); // store unfiltered data
      })
      .catch((error) => console.error("Error fetching booked rooms:", error));
  };

  useEffect(() => {
    fetchBookedRooms();
  }, []);

  // Filtering logic for BookedRooms
  const handleFilter = ({ roomNumber, checkInDate, checkOutDate }) => {
    let filtered = [...originalData];

    // Filter by room number (case-insensitive substring match)
    if (roomNumber.trim()) {
      filtered = filtered.filter((room) =>
        room.roomNumber.toLowerCase().includes(roomNumber.toLowerCase())
      );
    }

    // Example date filtering (adjust if your data uses different fields)
    if (checkInDate) {
      filtered = filtered.filter(
        (room) => new Date(room.checkInDate) >= new Date(checkInDate)
      );
    }
    if (checkOutDate) {
      filtered = filtered.filter(
        (room) => new Date(room.checkOutDate) <= new Date(checkOutDate)
      );
    }

    setBookedRooms(filtered);
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
          {/* <div className="w-full bg-white/35 p-5 shadow-md rounded-lg mb-4"> */}
            {/* Filter Section */}
            <div className="bg-white p-2 shadow-md rounded-lg mb-4">
              <BookedRoomsFilter onFilter={handleFilter} />
            </div>

            {/* Two-column layout for BookedRoomsTable (left) & RoomGrid (right) */}
            <div className="flex gap-4">
              {/* Booked Rooms Table */}
              <div className="w-3/4 bg-white/95 p-5 shadow-md rounded-lg">
                <BookedRoomsTable
                  bookedRooms={bookedRooms}
                  refreshBookings={fetchBookedRooms}
                />
              </div>

              {/* Room Grid */}
              <div className="w-1/4 bg-white p-5 shadow-md rounded-lg">
                <RoomGrid
                  rooms={bookedRooms}
                  onFilter={(roomNumber) =>
                    console.log("Show specific booking:", roomNumber)
                  }
                />
              </div>
            </div>
          </div>
        {/* </div> */}
      </div>
    </>
  );
};

export default BookedRooms;
