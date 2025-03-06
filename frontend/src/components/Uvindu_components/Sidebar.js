// Sidebar.js
import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ isVisible }) => {
  return (
    <div className={`sidebar ${isVisible ? "show" : "hide"} transition-all duration-300`}>
      {/* <div className="sidebar-logo">Hotel Management</div> */}
      <div className="sidebar-links">
        <Link to="/" className="sidebar-link">Dashboard</Link>
        <Link to="/staff" className="sidebar-link">Staff Management</Link>
        <Link to="/staff/add" className="sidebar-link">Add New Staff</Link>
        <Link to="/attendance" className="sidebar-link">Attendance</Link>
      </div>
    </div>
  );
};

export default Sidebar;
