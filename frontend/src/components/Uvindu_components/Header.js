// Header.js
import React from "react";
import { FaBars } from "react-icons/fa"; 

const Header = ({ onSidebarToggle }) => {
  return (
    <header className="fixed top-0 left-0 w-full bg-gray-800 text-white flex justify-between items-center p-4 z-50">
      <div className="text-xl font-semibold">Hotel Management</div>
      <div className="text-2xl cursor-pointer" onClick={onSidebarToggle}>
        <FaBars />
      </div>
    </header>
  );
};

export default Header;
