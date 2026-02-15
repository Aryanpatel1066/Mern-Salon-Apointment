import { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";

const LIMIT = 5;

const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchBookings = async (loadMore = false) => {
    try {
      setLoading(true);

      const { data } = await api.get("/booking/admin", {
        params: {
          limit: LIMIT,
          cursor: loadMore ? cursor : null,
        },
      });

      if (loadMore) {
        setBookings((prev) => [...prev, ...data.data]);
      } else {
        setBookings(data.data);
      }

      setCursor(data.nextCursor);
      setHasMore(data.hasMore);
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

      setBookings((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, status } : b
        )
      );

      toast.success("Booking status updated");
    } catch {
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
    } catch {
      toast.error("Failed to delete booking");
    }
  };

  useEffect(() => {
    fetchBookings(false); // first page
  }, []);

  return {
    bookings,
    loading,
    hasMore,
    loadMore: () => fetchBookings(true),
    updateStatus,
    deleteBooking,
  };
};

export default useBookings;
