import React from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react'; // Make sure to install it

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      {/* Left: Logo / Name */}
      <div className="text-2xl font-bold text-pink-600">
        <Link to="/">Salon Bliss</Link>
      </div>

      {/* Right: Notification + Login */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="relative">
          <Bell className="w-6 h-6 text-gray-700" />
          {/* Notification Count */}
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        {/* Login Button */}
        <Link
          to="/login"
          className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md transition-all"
        >
          Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
