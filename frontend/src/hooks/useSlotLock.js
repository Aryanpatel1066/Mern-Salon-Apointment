import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../api/api";
import { formatDate } from "../utils/dateUtils";

const LOCK_DURATION = 600; // 10 minutes

const useSlotLock = ({ date, serviceId }) => {
  const [timeSlot, setTimeSlot] = useState("");
  const [lockExpiresAt, setLockExpiresAt] = useState(null);
  const [timer, setTimer] = useState(0);

  // 🔒 Lock slot
  const lockSlot = async (slot) => {
    try {
      const res = await api.post("/lock-slot", {
        service: serviceId,
        date: formatDate(date),
        timeSlot: slot,
      });

      setTimeSlot(slot);
      setLockExpiresAt(new Date(res.data.expiresAt));
      setTimer(LOCK_DURATION);

      toast.info("⏳ Slot locked for 10 minutes");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Slot unavailable");
    }
  };

  // ⏱ Countdown timer
  useEffect(() => {
    if (!lockExpiresAt) return;

    const interval = setInterval(() => {
      const diff = Math.floor((lockExpiresAt - new Date()) / 1000);

      if (diff <= 0) {
        clearInterval(interval);
        setTimeSlot("");
        setLockExpiresAt(null);
        setTimer(0);
        toast.warn("⏰ Slot lock expired");
      } else {
        setTimer(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockExpiresAt]);

  // 🔁 Reset lock when date changes
  useEffect(() => {
    setTimeSlot("");
    setLockExpiresAt(null);
    setTimer(0);
  }, [date]);

  return {
    timeSlot,
    timer,
    lockSlot,
    clearLock: () => {
      setTimeSlot("");
      setLockExpiresAt(null);
      setTimer(0);
    },
  };
};

export default useSlotLock;
