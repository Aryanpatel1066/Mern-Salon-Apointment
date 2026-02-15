import { Trash2 } from "lucide-react";
import useBookings from "../hooks/adminHooks/useBookings";

function AdminBookingManagement() {
  const {
    bookings,
    loading,
    hasMore,
    loadMore,
    updateStatus,
    deleteBooking,
  } = useBookings();

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Booking Management</h1>

      {bookings.length === 0 && !loading ? (
        <p className="text-gray-500">No bookings found.</p>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white border rounded-lg p-4 shadow flex flex-col md:flex-row md:items-center justify-between"
            >
              <div className="space-y-1">
                <p className="font-semibold text-lg">
                  {booking.service?.name}
                </p>
                <p className="text-sm text-gray-600">
                  🗓️ {new Date(booking.date).toLocaleDateString()} • ⏰{" "}
                  {booking.timeSlot}
                </p>
                <p className="text-sm text-gray-500">
                  👤 {booking.user?.name} • 📧 {booking.user?.email}
                </p>
              </div>

              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <select
                  value={booking.status}
                  onChange={(e) =>
                    updateStatus(booking._id, e.target.value)
                  }
                  className="border rounded px-3 py-1 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <button
                  onClick={() => deleteBooking(booking._id)}
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LOAD MORE */}
      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminBookingManagement;
