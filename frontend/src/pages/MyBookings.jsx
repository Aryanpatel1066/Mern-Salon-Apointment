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
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const [openMenu, setOpenMenu] = useState(null);
  const [editModal, setEditModal] = useState(null);
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

  // 🔥 FETCH BOOKINGS (WITH PAGINATION)
  const loadBookings = async (loadMore = false) => {
    try {
      setLoading(true);

      const res = await api.get(`/booking/user/${userId}`, {
        params: {
          limit: 6,
          cursor: loadMore ? cursor : null,
        },
      });

      const { data, nextCursor, hasMore } = res.data;

      if (loadMore) {
        setBookings((prev) => [...prev, ...data]);
      } else {
        setBookings(data);
      }

      setCursor(nextCursor);
      setHasMore(hasMore);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    loadBookings(false);
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
    setConfirmEdit({ open: true, booking });
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
      toast.success("✅ Booking cancelled");

      // reload first page
      setCursor(null);
      loadBookings(false);
    } catch (error) {
      toast.error("❌ Failed to cancel booking");
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

        {bookings.length === 0 && !loading ? (
          <div className="flex flex-col items-center py-20">
            <img src={emptyBooking} alt="No bookings" className="w-64 mb-6" />
            <p className="text-gray-500 text-lg">No bookings yet</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white p-5 rounded-xl shadow border-l-4 border-pink-400 relative"
                >
                  {/* 3 DOT MENU */}
                  {booking.status === "pending" && (
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() =>
                          setOpenMenu(
                            openMenu === booking._id ? null : booking._id
                          )
                        }
                        className="text-gray-600"
                      >
                        ⋮
                      </button>

                      {openMenu === booking._id && (
                        <div className="absolute right-0 mt-1 w-32 bg-white border rounded shadow z-10">
                          <button
                            onClick={() => handleEditRequest(booking)}
                            className="block w-full px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDeleteRequest(booking._id)}
                            className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <p className="text-sm text-gray-500">
                    📅{" "}
                    {new Date(booking.date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-gray-600">
                    ⏰ {booking.timeSlot}
                  </p>
                  <p className="text-lg font-semibold">
                    {booking.service?.name}
                  </p>
                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${getStatusStyles(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>

            {/* LOAD MORE BUTTON */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => loadBookings(true)}
                  disabled={loading}
                  className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                >
                  {loading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmDialog
        open={confirmDelete.open}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking?"
        confirmText="Yes, Cancel"
        cancelText="No"
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
        confirmText="Yes"
        cancelText="No"
        onCancel={() => setConfirmEdit({ open: false, booking: null })}
        onConfirm={handleEditConfirm}
      />

      {editModal && (
        <EditBookingModal
          booking={editModal}
          onClose={() => setEditModal(null)}
          onSuccess={() => {
            setCursor(null);
            loadBookings(false);
          }}
        />
      )}
    </div>
  );
}

export default MyBookings;
