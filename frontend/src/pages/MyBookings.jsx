import React, { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId"); // ✅ Move this outside

  const loadBooking = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("User ID not found in localStorage");
        return;
      }

      const res = await api.get(`/booking/user/${userId}`);
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   loadBooking();
  // }, []);
  useEffect(() => {
    loadBooking(); // initial load

    const interval = setInterval(() => {
      loadBooking(); // auto-refresh every 2s
    }, 2000);

    return () => clearInterval(interval); // cleanup on unmount
  }, [userId]);

  const getStatusStyles = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto mt-10 px-4">
        <h1 className="text-3xl font-bold text-center text-pink-600 mb-8">
          My Bookings
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : bookings.length === 0 ? (
          <p className="text-center text-gray-500">No bookings found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white p-5 rounded-xl shadow hover:shadow-md transition border-l-4 border-pink-400"
              >
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">
                    📅{" "}
                    {new Date(booking.date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-gray-600">⏰ {booking.timeSlot}</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {booking.service?.name || "Service not available"}
                  </p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusStyles(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookings;
