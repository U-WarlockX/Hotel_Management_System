// AvailableRooms.js
import React, { useState, useEffect } from "react";
import axios from "axios";

// Components
import Header from "../../components/Bawantha_components/Header";
import Sidebar from "../../components/Bawantha_components/Sidebar";
import AvailableRoomsTable from "../../components/Bawantha_components/AvailableRoomsTable";
import RoomGrid from "../../components/Bawantha_components/RoomGrid";
import Filters from "../../components/Bawantha_components/Filters";

/**
 * Inline Background Slideshow Component
 * Cycles through the array of images with fade-in/out transitions.
 */
const BackgroundSlideshow = () => {
  const images = [
    "https://expressinnindia.com/wp-content/uploads/2024/07/Freesia-God-23.jpg",
    "https://expressinnindia.com/wp-content/uploads/2024/07/Freesia-God-20.jpg",
    "https://expressinnindia.com/wp-content/uploads/2022/08/JR.-SUITE-BOISAR-1-scaled.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Switch to next image every 3 seconds
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

const AvailableRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);

  // Fetch rooms on mount
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/rooms")
      .then((response) => {
        setRooms(response.data.data);
        setFilteredRooms(response.data.data);
      })
      .catch((error) => console.error("Error fetching rooms:", error));
  }, []);

  // Filter logic (unchanged)
  const filterRooms = ({ searchTerm, selectedDate, acFilter, bedType }) => {
    let filtered = [...rooms];

    if (searchTerm) {
      filtered = filtered.filter((room) =>
        room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (acFilter && acFilter !== "All") {
      filtered = filtered.filter((room) => room.roomType === acFilter);
    }
    if (bedType && bedType !== "All") {
      filtered = filtered.filter((room) => room.bedType === bedType);
    }

    setFilteredRooms(filtered);
  };

  return (
    <>
      {/* Fixed header at the top */}
      <Header />

      {/* Main container: background slideshow behind everything */}
      <div className="flex min-h-screen relative">
        {/* Slideshow in the background */}
        <BackgroundSlideshow />

        {/* Permanent sidebar on the left */}
        <Sidebar />

        {/* Right side content */}
        {/* flex-1 -> takes remaining space.  pt-20 -> gap from the header. px-4 -> small side padding */}
        <div className="flex-1 text-sm pt-20 pl-4 pr-12 relative z-10">
          {/* Container with no max-width so it can expand fully */}
          {/* <div className="w-full bg-white p-5 shadow-md rounded-lg mb-4"> */}
            {/* <h1 className=\"text-2xl font-bold mb-4 text-white-900\">Available Rooms</h1> */}

            {/* Filters */}
            <div className="bg-white p-2 shadow-md rounded-lg mb-4">
              <Filters onFilter={filterRooms} />
            </div>

            {/* Table & Grid Layout */}
            <div className="flex gap-4">
              <div className="w-3/4 bg-white/95 p-5 shadow-md rounded-lg">
                <AvailableRoomsTable rooms={filteredRooms} />
              </div>
              {/* Use w-1/4 for the second column */}
              
              <div className="w-1/4 bg-white p-5 shadow-md rounded-lg">
              <h3 className="text-xl font-semibold mb-4">All Rooms</h3>
                <RoomGrid
                  rooms={rooms}
                  onFilter={(roomNumber) =>
                    filterRooms({ searchTerm: roomNumber })
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

export default AvailableRooms;
