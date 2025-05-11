 import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Bell, User, CalendarIcon } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import api from "../api/api"; // Ensure you use the same instance as in Notification.jsx

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get("/notifications/unread-count", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUnreadCount(res.data.count);
    } catch (err) {
      console.error("Failed to fetch notification count");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        jwtDecode(token);
        setIsLoggedIn(true);
        fetchUnreadCount(); // Only fetch if logged in
      } catch {
        setIsLoggedIn(false);
      }
    }
  }, []);

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <div className="text-2xl font-bold text-pink-600">
        <Link to="/">Salon Bliss</Link>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative">
          <NavLink to="/notification">
            <Bell className="w-6 h-6 text-gray-700" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </NavLink>
        </button>
        <Link
          to="/my-bookings"
          className="text-sm text-gray-700 hover:text-pink-500 flex items-center gap-1"
        >
          <CalendarIcon className="w-5 h-5" />
        </Link>

        {!isLoggedIn ? (
          <Link
            to="/login"
            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md transition-all"
          >
            Login
          </Link>
        ) : (
          <button onClick={handleProfileClick}>
            <User className="w-6 h-6 text-gray-700" />
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
