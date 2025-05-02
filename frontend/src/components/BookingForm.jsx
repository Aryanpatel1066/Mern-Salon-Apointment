 
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../api/api";
import Navbar from "../components/Navbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookingForm = () => {
  const [date, setDate] = useState(null);
  const [timeSlot, setTimeSlot] = useState("");
  const [serviceId, setServiceId] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const timeSlots = [
    "7AM to 8AM", "8AM to 9AM", "9AM to 10AM", "10AM to 11AM",
    "11AM to 12PM", "12PM to 1PM", "1PM to 2PM", "2PM to 3PM",
    "3PM to 4PM", "4PM to 5PM", "5PM to 6PM", "6PM to 7PM"
  ];

  useEffect(() => {
    const storedServiceId = localStorage.getItem("selectedServiceId");
    if (storedServiceId) {
      setServiceId(storedServiceId);
      setTimeSlot("");
    } else {
      toast.error("❌ No service selected. Please go back and choose one.");
    }
  }, []);

  useEffect(() => {
    fetchBookedSlots();
  }, [date]);  // Fetch booked slots whenever the date changes

  const fetchBookedSlots = async () => {
    if (!date) return;

    try {
      const formattedDate = date.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
      const res = await api.get("/booking/booked-slots", {
        params: { date: formattedDate },
      });
      setBookedSlots(res.data.bookedSlots || []);
    } catch (err) {
      console.error("Error fetching booked slots:", err);
      setBookedSlots([]);
    }
  };

  const handleSubmit = async () => {
    if (!date || !timeSlot || !serviceId) {
      return toast.error("❌ Please select a date, time, and service.");
    }

    try {
      await api.post("/booking", {
        service: serviceId,
        date,
        timeSlot,
      });

      toast.success("✅ Booking confirmed!");
      setTimeSlot(""); // Reset time slot after booking

      // 🔄 Refresh slots immediately after booking
      fetchBookedSlots();
    } catch (err) {
      toast.error(err?.response?.data?.message || "❌ Booking failed.");
    }
  };

  // Function to check if the slot is booked
  const isSlotBooked = (slot) => {
    return bookedSlots
      .map((s) => s.trim().toLowerCase())  // Normalize to lowercase for comparison
      .includes(slot.trim().toLowerCase());
  };

  return (
    <div>
      <Navbar />
      <ToastContainer position="top-center" />
      <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-xl space-y-6 mt-4">
        <h2 className="text-xl font-bold text-pink-500">Booking Page</h2>

        {/* Date Picker */}
        <div>
          <label className="block text-sm font-medium mb-1">Select a date</label>
          <DatePicker
            selected={date}
            onChange={(d) => {
              setDate(d);
              setTimeSlot(""); // Reset time slot when date changes
            }}
            minDate={tomorrow}
            className="w-full p-2 border rounded"
            placeholderText="Choose a day"
          />
        </div>

        {/* Time Slots */}
        <div>
          <label className="block text-sm font-medium mb-1">Select a time</label>
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.map((slot) => {
              const booked = isSlotBooked(slot);
              const selected = timeSlot === slot;

              return (
                <button
                  key={slot}
                  onClick={() => !booked && setTimeSlot(slot)}
                  disabled={booked}
                  className={`p-2 border rounded text-sm transition
                    ${booked ? "bg-gray-400 text-white cursor-not-allowed" 
                      : selected ? "bg-pink-500 text-white" 
                      : "hover:bg-pink-100"}
                  `}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>

        {/* Address */}
        <div className="p-3 border rounded bg-gray-50">
          <p className="text-sm text-gray-600">📍 382 Vijapur, Gujarat</p>
        </div>

        {/* Payment */}
        <div className="p-3 border rounded bg-gray-50">
          <p className="text-sm text-gray-600">💳 Pay ₹149 after services</p>
        </div>

        {/* Submit Button */}
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
