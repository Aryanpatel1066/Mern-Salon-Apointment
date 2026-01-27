import React, { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditBookingModal from "../components/EditBookingModel";
import emptyBooking from "../assets/emptyBooking.png";
import ConfirmDialog from "../components/ConfirmDailog";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState(null); // Track which menu is open
  const [editModal, setEditModal] = useState(null); // Track booking being edited
  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    bookingId: null,
  });
  const [confirmEdit, setConfirmEdit] = useState({
    open: false,
    booking: null,
  });

  const [deleting, setDeleting] = useState(false);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

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

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    loadBooking();

    const interval = setInterval(() => {
      loadBooking();
    }, 5000);

    return () => clearInterval(interval);
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

  const handleDeleteRequest = (bookingId) => {
    setConfirmDelete({ open: true, bookingId });
  };
  const handleEditRequest = (booking) => {
    setConfirmEdit({
      open: true,
      booking,
    });
    setOpenMenu(null);
  };
  const handleEditConfirm = () => {
    setEditModal(confirmEdit.booking);
    setConfirmEdit({ open: false, booking: null });
  };
  const handleDeleteConfirm = async () => {
    try {
      setDeleting(true);
      await api.delete(`/booking/${confirmDelete.bookingId}`);
      toast.success("✅ Booking cancelled successfully");
      loadBooking();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "❌ Failed to cancel booking",
      );
    } finally {
      setDeleting(false);
      setConfirmDelete({ open: false, bookingId: null });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ToastContainer position="top-center" />

      <div className="max-w-4xl mx-auto mt-10 px-4">
        <h1 className="text-3xl font-bold text-center text-pink-600 mb-8">
          My Bookings
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <img
              src={emptyBooking}
              alt="No bookings"
              className="w-64 mb-6 opacity-80"
            />
            <p className="text-gray-500 text-lg">No bookings yet</p>
            <p className="text-gray-400 text-sm">
              Book a service to see it here ✂️
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white p-5 rounded-xl shadow hover:shadow-md transition border-l-4 border-pink-400 relative"
              >
                {/* 3-Dot Menu - Only for PENDING bookings */}
                {booking.status === "pending" && (
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() =>
                        setOpenMenu(
                          openMenu === booking._id ? null : booking._id,
                        )
                      }
                      className="text-gray-600 hover:text-gray-800 p-1"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {openMenu === booking._id && (
                      <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border z-10">
                        <button
                          onClick={() => handleEditRequest(booking)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteRequest(booking._id)}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}

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
                      booking.status,
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
      <ConfirmDialog
        open={confirmDelete.open}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Yes, Cancel"
        cancelText="No, Keep"
        loading={deleting}
        onCancel={() =>
          !deleting && setConfirmDelete({ open: false, bookingId: null })
        }
        onConfirm={handleDeleteConfirm}
      />
      <ConfirmDialog
        open={confirmEdit.open}
        title="Edit Booking"
        message="Do you want to edit this booking?"
        confirmText="Yes, Edit"
        cancelText="Cancel"
        onCancel={() => setConfirmEdit({ open: false, booking: null })}
        onConfirm={handleEditConfirm}
      />

      {/* Edit Modal - Next Step */}
      {editModal && (
        <EditBookingModal
          booking={editModal}
          onClose={() => setEditModal(null)}
          onSuccess={loadBooking}
        />
      )}
    </div>
  );
}

export default MyBookings;
