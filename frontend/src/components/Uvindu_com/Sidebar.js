import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <ul>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/bookings">Bookings</Link></li>
                <li><Link to="/customers">Customers</Link></li>
                <li><Link to="/rooms">Rooms</Link></li>
                <li><Link to="/staff">Staff</Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;
