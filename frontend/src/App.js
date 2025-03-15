import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/Uvindu_components/Sidebar";
import Header from "./components/Uvindu_components/Header";  // Import Header
import Dashboard from "./components/Uvindu_components/Dashboard";
import StaffList from "./components/Uvindu_components/StaffList";
import AddStaff from "./components/Uvindu_components/AddStaff";
import StaffAttendance from "./components/Uvindu_components/StaffAttendance";  // Updated for attendance
import "./App.css";

function App() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // Initially hidden

  const handleSidebarToggle = () => {
    setIsSidebarVisible((prevState) => !prevState); // Toggle visibility
  };

  return (
    <div className="app-container">
      <Header onSidebarToggle={handleSidebarToggle} /> {/* Pass function to Header */}
      <div className="flex mt-16"> {/* Added margin-top to push content below header */}
        <Sidebar isVisible={isSidebarVisible} /> {/* Pass the visibility state to Sidebar */}
        <div className="content flex-1 p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/staff" element={<StaffList />} />
            <Route path="/staff/add" element={<AddStaff />} />
            <Route path="/attendance" element={<StaffAttendance />} /> {/* Updated route */}
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
