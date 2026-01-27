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
          className="w-full p-2 border rounded"
          placeholderText="Select date"
        />

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

        {timer > 0 && (
          <p className="text-center text-red-500 text-sm">
            ⏳ Time left: {Math.floor(timer / 60)}:
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
