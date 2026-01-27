import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Bell, User, CalendarIcon } from "lucide-react";
import useAuth from "../hooks/useAuth";
import useNotifications from "../hooks/useNotifications";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { unreadCount } = useNotifications(); // 👈 READ ONLY

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <div className="text-2xl font-bold text-pink-600">
        <Link to="/">Salon Bliss</Link>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <NavLink to="/notification" className="relative">
            <Bell className="w-6 h-6 text-gray-700" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </NavLink>
        )}

        {user && (
          <Link
            to="/my-bookings"
            className="text-sm text-gray-700 hover:text-pink-500 flex items-center gap-1"
          >
            <CalendarIcon className="w-5 h-5" />
          </Link>
        )}

        {!user ? (
          <Link
            to="/login"
            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md transition"
          >
            Login
          </Link>
        ) : (
          <button onClick={() => navigate("/profile")}>
            <User className="w-6 h-6 text-gray-700" />
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
