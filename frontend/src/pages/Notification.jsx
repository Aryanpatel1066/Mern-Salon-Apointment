import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import useNotifications from "../hooks/useNotifications";
import useAuth from "../hooks/useAuth";
import emptyNotification from "../assets/emptyNotification.png"
const Notification = () => {
  const { user, loading: authLoading } = useAuth();
  const { notifications, loading, error, unreadCount, markAllAsRead } =
    useNotifications();

  const navigate = useNavigate();

  // redirect safely
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [authLoading, user, navigate]);

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="p-4 max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Notifications</h2>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600 transition"
            >
              Mark all as read ({unreadCount})
            </button>
          )}
        </div>

        <ul className="space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center p-10">
              <img
                src={emptyNotification}
                alt="No Notifications"
                className="mx-auto w-40 h-40"
              />
              <h2 className="text-xl font-bold mt-4 text-gray-700">
                You have 0 notifications
              </h2>
              <p className="text-gray-500 mt-2">
                Check back later for alerts and updates!
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <li
                key={n._id}
                className={`p-3 border rounded-md ${
                  !n.read ? "bg-yellow-50 border-yellow-400" : "bg-gray-50"
                }`}
              >
                <p
                  className={`font-semibold ${
                    n.message.toLowerCase().includes("cancelled")
                      ? "text-red-600"
                      : "text-green-800"
                  }`}
                >
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
    </>
  );
};

export default Notification;
