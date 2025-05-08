import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { Trash2 } from 'lucide-react';
// import axios from axios;
function AdminBookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/booking/'); // admin route
      setBookings(res.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/booking/${id}/status`, { status });
      fetchBookings();
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    try {
      await api.delete(`/booking/${id}`);
      fetchBookings();
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  if (loading) return <p className="p-4 text-gray-600">Loading bookings...</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Booking Management</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings found.</p>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white border rounded-lg p-4 shadow flex flex-col md:flex-row md:items-center justify-between"
            >
              <div className="space-y-1 mb-4 md:mb-0">
                <p className="font-semibold text-lg">{booking.service?.name}</p>
                <p className="text-sm text-gray-600">
                  🗓️ {new Date(booking.date).toLocaleDateString()} • ⏰ {booking.timeSlot}
                </p>
                <p className="text-sm text-gray-500">
                  👤 {booking.user?.name} • 📧 {booking.user?.email}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <select
                  value={booking.status}
                  onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <button
                  onClick={() => handleDelete(booking._id)}
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminBookingManagement;
