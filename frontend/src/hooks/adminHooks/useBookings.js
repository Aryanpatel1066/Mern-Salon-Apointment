import { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";

const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/booking");
      setBookings(data);
    } catch (error) {
      toast.error("Failed to load bookings");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/booking/${id}/status`, { status });

      // 🔥 Optimistic update (NO refetch)
      setBookings((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, status } : b
        )
      );

      toast.success("Booking status updated");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const deleteBooking = async (id) => {
    try {
      await api.delete(`/booking/${id}`);

      setBookings((prev) =>
        prev.filter((b) => b._id !== id)
      );

      toast.success("Booking deleted");
    } catch (error) {
      toast.error("Failed to delete booking");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return {
    bookings,
    loading,
    updateStatus,
    deleteBooking,
    refetch: fetchBookings,
  };
};

export default useBookings;
