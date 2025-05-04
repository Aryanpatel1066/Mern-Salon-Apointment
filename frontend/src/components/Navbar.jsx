import React, { useEffect, useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import { Bell, User,CalendarIcon} from "lucide-react";
 import { jwtDecode } from "jwt-decode";
const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        jwtDecode(token); // verifies token
        setIsLoggedIn(true);
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
          <Bell className="w-6 h-6 text-gray-700" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">3</span>
        </button>
        <Link to="/my-bookings" className="text-sm text-gray-700 hover:text-pink-500 flex items-center gap-1">
  <CalendarIcon className="w-5 h-5" />
   
</Link>

        {!isLoggedIn ? (
          <Link to="/login" className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md transition-all">
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
