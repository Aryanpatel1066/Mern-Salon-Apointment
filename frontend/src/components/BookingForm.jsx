import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../api/api";
import Navbar from "../components/Navbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../components/ConfirmDailog";
import { formatDate, getTomorrow } from "../utils/dateUtils";
import useClosedDays from "../hooks/useClosedDays";
import useTimeSlots from "../hooks/useTimeSlots";
import useSlotLock from "../hooks/useSlotLock";
const BookingForm = () => {
  const navigate = useNavigate();

  const [date, setDate] = useState(getTomorrow());
  const [serviceId, setServiceId] = useState(null);
  const [servicePrice, setServicePrice] = useState(null);

  const token = localStorage.getItem("token");
  const [confirmBooking, setConfirmBooking] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const { allowDate } = useClosedDays();
  const { timeSlots, isBooked, isLocked } = useTimeSlots({
    date,
    token,
    navigate,
  });
  const { timeSlot, timer, lockSlot, clearLock } = useSlotLock({
    date,
    serviceId,
  });
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
  }, [navigate]);

  const handleSubmitRequest = () => {
    if (!date || !timeSlot || !serviceId) {
      toast.error("❌ Please select date and time");
      return;
    }
    setConfirmBooking(true);
  };

  const handleBookingConfirm = async () => {
    try {
      setBookingLoading(true);

      await api.post("/booking", {
        service: serviceId,
        date: formatDate(date),
        timeSlot,
      });

      toast.success("✅ Booking confirmed");
      navigate("/success");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
      setConfirmBooking(false);
    }
  };

  return (
    <div>
      <Navbar />
      <ToastContainer position="top-center" />

      <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-xl mt-6 space-y-5">
        <h2 className="text-xl font-bold text-pink-500 text-center">
          Book Appointment
        </h2>

        <DatePicker
          selected={date}
          onChange={(d) => {
            setDate(d);
            clearLock();
          }}
          minDate={getTomorrow()}
          filterDate={allowDate}
          dateFormat="dd MMM yyyy"
          className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
          calendarClassName="rounded-lg shadow-lg"
          placeholderText="Select appointment date"
        />

        <div className="flex flex-wrap gap-3 text-xs mt-2">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-white border rounded"></span> Available
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-pink-500 rounded"></span> Selected
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-yellow-300 rounded"></span> Locked
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-gray-300 rounded"></span> Booked
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {timeSlots.map((slot) => {
            const booked = isBooked(slot);
            const locked = isLocked(slot);
            const selected = timeSlot === slot;

            return (
              <div
                key={slot}
                title={
                  booked
                    ? "This slot is already booked"
                    : locked
                      ? "Temporarily reserved by another user. May become available soon."
                      : selected
                        ? "Selected by you"
                        : "Click to reserve this slot"
                }
              >
                <button
                  key={slot}
                  disabled={booked || locked}
                  onClick={() => lockSlot(slot)}
                  className={`relative w-full p-2 rounded-lg text-sm font-medium border transition-all
    ${
      booked
        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
        : locked
          ? "bg-yellow-300 text-gray-800 cursor-not-allowed"
          : selected
            ? "bg-pink-500 text-white border-pink-500"
            : "bg-white hover:bg-pink-100 border-gray-300"
    }
  `}
                >
                  {slot}

                  {booked && (
                    <span className="absolute top-1 right-1 text-xs">🔒</span>
                  )}

                  {/* LOCKED BY OTHER USER */}
                  {locked && !booked && (
                    <span className="absolute top-1 right-1 text-xs">⏳</span>
                  )}

                  {/* SELECTED BY YOU */}
                  {selected && (
                    <span className="absolute top-1 right-1 text-xs">✔</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {timer > 0 && (
          <p className="text-center text-red-500 text-sm">
            ⏳ Slot reserved for you: {Math.floor(timer / 60)}:
            {String(timer % 60).padStart(2, "0")}
          </p>
        )}

        <div className="p-3 bg-gray-50 rounded text-sm text-gray-600">
          💳 Pay ₹{servicePrice} after service
        </div>

        <button
          onClick={handleSubmitRequest}
          className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600"
        >
          Book Now
        </button>

        <ConfirmDialog
          open={confirmBooking}
          title="Confirm Booking"
          message={`Confirm booking on ${formatDate(date)} at ${timeSlot}?`}
          confirmText="Yes, Book"
          cancelText="Cancel"
          loading={bookingLoading}
          onCancel={() => !bookingLoading && setConfirmBooking(false)}
          onConfirm={handleBookingConfirm}
        />
      </div>
    </div>
  );
};

export default BookingForm;
