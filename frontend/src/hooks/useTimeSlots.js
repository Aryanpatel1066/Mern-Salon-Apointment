import { useEffect, useState, useCallback } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
import { formatDate } from "../utils/dateUtils";

const useTimeSlots = ({ date, token, navigate ,ignoreSlot = null,
  ignoreDate = null, }) => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [lockedSlots, setLockedSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch available time slots
  useEffect(() => {
    if (!date) return;

    const fetchTimeSlots = async () => {
      try {
        const res = await api.get("/time-slots", {
          params: { date: formatDate(date) },
        });
        setTimeSlots(res.data.slots || []);
      } catch {
        toast.error("Failed to load time slots");
        setTimeSlots([]);
      }
    };

    fetchTimeSlots();
  }, [date]);

  // Fetch booked + locked slots
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (!date) return;

    const fetchSlots = async () => {
      setLoading(true);
      try {
        const res = await api.get("/booking/booked-slots", {
          params: { date: formatDate(date) },
        });

        setBookedSlots(res.data.bookedSlots || []);
        setLockedSlots(res.data.lockedSlots || []);
      } catch {
        setBookedSlots([]);
        setLockedSlots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [date, token, navigate]);

  // Helpers
const isBooked = (slot) => {
  // 👇 allow current booking slot while editing
  if (
    ignoreSlot &&
    ignoreDate &&
    formatDate(date) === ignoreDate &&
    slot === ignoreSlot
  ) {
    return false;
  }

  return bookedSlots
    .map((s) => s.toLowerCase())
    .includes(slot.toLowerCase());
};

const isLocked = (slot) => {
  if (
    ignoreSlot &&
    ignoreDate &&
    formatDate(date) === ignoreDate &&
    slot === ignoreSlot
  ) {
    return false;
  }

  return lockedSlots
    .map((s) => s.toLowerCase())
    .includes(slot.toLowerCase());
};

  return {
    timeSlots,
    isBooked,
    isLocked,
    loading,
  };
};

export default useTimeSlots;
