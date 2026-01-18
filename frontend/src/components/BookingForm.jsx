import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../api/api";
import Navbar from "../components/Navbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const BookingForm = () => {
  const navigate = useNavigate();

  const [date, setDate] = useState(null);
  const [timeSlot, setTimeSlot] = useState("");
  const [serviceId, setServiceId] = useState(null);
  const [servicePrice, setServicePrice] = useState(null);

  const [bookedSlots, setBookedSlots] = useState([]);
  const [lockedSlots, setLockedSlots] = useState([]);

  const [lockExpiresAt, setLockExpiresAt] = useState(null);
  const [timer, setTimer] = useState(0);

  const [closedDays, setClosedDays] = useState([]);

  const token = localStorage.getItem("token");

  const timeSlots = [
    "7AM to 8AM",
    "8AM to 9AM",
    "9AM to 10AM",
    "10AM to 11AM",
    "11AM to 12PM",
    "12PM to 1PM",
    "1PM to 2PM",
    "2PM to 3PM",
    "3PM to 4PM",
    "4PM to 5PM",
    "5PM to 6PM",
    "6PM to 7PM",
  ];

  // Format date to YYYY-MM-DD (local)
  const fmt = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  };

  // Tomorrow min date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Load service from localStorage
  useEffect(() => {
    const sid = localStorage.getItem("selectedServiceId");
    const sprice = localStorage.getItem("selectedServicePrice");

    if (!sid || !sprice) {
      toast.error("❌ No service selected");
      navigate("/");
      return;
    }

    setServiceId(sid);
    setServicePrice(sprice);
  }, []);

  // Fetch closed days
  useEffect(() => {
    const fetchClosedDays = async () => {
      try {
        const res = await api.get("/closed-days");
        setClosedDays(res.data.closedDays.map((d) => d.date));
      } catch {
        toast.error("Failed to load closed days");
      }
    };
    fetchClosedDays();
  }, []);

  // Fetch booked + locked slots when date changes
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (!date) return;

    const fetchSlots = async () => {
      try {
        const res = await api.get("/booking/booked-slots", {
          params: { date: fmt(date) },
        });

        setBookedSlots(res.data.bookedSlots || []);
        setLockedSlots(res.data.lockedSlots || []);
      } catch {
        setBookedSlots([]);
        setLockedSlots([]);
      }
    };

    fetchSlots();
  }, [date]);

  // Lock slot
  const lockSlot = async (slot) => {
    try {
      const res = await api.post("/booking/lock-slot", {
        service: serviceId,
        date: fmt(date),
        timeSlot: slot,
      });

      setTimeSlot(slot);
      setLockExpiresAt(new Date(res.data.expiresAt));
      setTimer(600);

      toast.info("⏳ Slot locked for 10 minutes");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Slot unavailable");
    }
  };

  // Countdown timer
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

  // Submit booking
  const handleSubmit = async () => {
    if (!date || !timeSlot || !serviceId) {
      return toast.error("❌ Please select date and time");
    }

    try {
      await api.post("/booking", {
        service: serviceId,
        date: fmt(date),
        timeSlot,
      });

      toast.success("✅ Booking confirmed");
      navigate("/success");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Booking failed");
    }
  };

  const isBooked = (slot) =>
    bookedSlots.map((s) => s.toLowerCase()).includes(slot.toLowerCase());

  const isLocked = (slot) =>
    lockedSlots.map((s) => s.toLowerCase()).includes(slot.toLowerCase());

  const allowDate = (d) => !closedDays.includes(fmt(d));

  return (
    <div>
      <Navbar />
      <ToastContainer position="top-center" />

      <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-xl mt-6 space-y-5">
        <h2 className="text-xl font-bold text-pink-500 text-center">
          Book Appointment
        </h2>

        {/* Date Picker */}
        <DatePicker
          selected={date}
          onChange={(d) => {
            setDate(d);
            setTimeSlot("");
            setLockExpiresAt(null);
          }}
          minDate={tomorrow}
          filterDate={allowDate}
          className="w-full p-2 border rounded"
          placeholderText="Select date"
        />

        {/* Time Slots */}
        <div className="grid grid-cols-2 gap-2">
          {timeSlots.map((slot) => {
            const booked = isBooked(slot);
            const locked = isLocked(slot);
            const selected = timeSlot === slot;

            return (
              <button
                key={slot}
                disabled={booked || locked}
                onClick={() => lockSlot(slot)}
                className={`p-2 rounded text-sm border transition
                  ${
                    booked
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : locked
                        ? "bg-yellow-400 text-black cursor-not-allowed"
                        : selected
                          ? "bg-pink-500 text-white"
                          : "hover:bg-pink-100"
                  }`}
              >
                {slot}
              </button>
            );
          })}
        </div>

        {/* Timer */}
        {timer > 0 && (
          <p className="text-center text-red-500 text-sm">
            ⏳ Time left: {Math.floor(timer / 60)}:
            {String(timer % 60).padStart(2, "0")}
          </p>
        )}

        {/* Payment */}
        <div className="p-3 bg-gray-50 rounded text-sm text-gray-600">
          💳 Pay ₹{servicePrice} after service
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default BookingForm;
