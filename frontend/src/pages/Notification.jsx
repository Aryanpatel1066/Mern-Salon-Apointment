 import React, { useEffect, useState } from "react";
import api from "../api/api";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
    const token = localStorage.getItem("token");

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setNotifications(res.data);
      const unread = res.data.filter(n => !n.read).length;
      setUnreadCount(unread);
     } catch (err) {
      setError("Failed to load notifications");
     }
    finally {
      setLoading(false);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await api.patch("/notifications/mark-read", {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchNotifications(); // Refresh list
    } catch (err) {
      console.error("Failed to mark as read");
    }
  };

  useEffect(() => {
      if (!token) {
      navigate("/login");
      return;
    }
    fetchNotifications();
  }, []);

   if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  return (
    <div>
        <Navbar/>
    <div className="p-4 max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Notifications</h2>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600 transition-all"
          >
            Mark all as read ({unreadCount})
          </button>
        )}
      </div>
      <ul className="space-y-3">
        {notifications.length === 0 ? (
          <p>No notifications yet.</p>
        ) : (
          notifications.map(n => (
            <li
              key={n._id}
              className={`p-3 border rounded-md ${
                !n.read ? "bg-yellow-50 border-yellow-400" : "bg-yellow-50"
              }`}
            >
              <p className={`${n.message.toLowerCase().includes("cancelled") ? "text-red-600 font-semibold" : "text-green-800 font-semibold"}`}>
                {n.message}
              </p>
              <small className="text-gray-500 block mt-1">
                {new Date(n.createdAt).toLocaleString()}
              </small>
            </li>
          ))
        )}
      </ul>
    </div>
    </div>
  );
};

export default Notification;
