import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
    return (
        <div className="navbar">
            <div className="nav-left">
                <h2>Admin Dashboard</h2>
            </div>
            <div className="nav-right">
                <img src="/public/profile-pic.png" alt="Admin Profile" className="profile-pic" />
                <FontAwesomeIcon icon={faUserCircle} />
                <div className="profile-dropdown">
                    <Link to="/profile">View Profile</Link>
                    <Link to="/logout">Log Out</Link>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
