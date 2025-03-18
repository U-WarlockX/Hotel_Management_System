import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="fixed left-0 top-11 h-[95vh] w-64 bg-gray-900 text-white shadow-lg rounded-r-xl transition-all duration-300">
  
        <nav className="mt-4">
          <ul>
            <li>
              <Link
                to="/"
                className="block py-3 px-6 text-gray-300 hover:bg-gray-700 hover:text-white transition rounded-md"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/staff"
                className="block py-3 px-6 text-gray-300 hover:bg-gray-700 hover:text-white transition rounded-md"
              >
                Staff Management
              </Link>
            </li>
            <li>
              <Link
                to="/staff/add"
                className="block py-3 px-6 text-gray-300 hover:bg-gray-700 hover:text-white transition rounded-md"
              >
                Add New Staff
              </Link>
            </li>
            <li>
              <Link
                to="/attendance"
                className="block py-3 px-6 text-gray-300 hover:bg-gray-700 hover:text-white transition rounded-md"
              >
                Attendance
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-6 w-full">
        {/* Main content goes here */}
      </div>
    </div>
  );
};

export default Sidebar;
