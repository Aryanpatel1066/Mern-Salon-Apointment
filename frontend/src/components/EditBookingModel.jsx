import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../api/api";
import { toast } from "react-toastify";

const EditBookingModal = ({ booking, onClose, onSuccess }) => {
  const [date, setDate] = useState(new Date(booking.date));
  const [timeSlot, setTimeSlot] = useState(booking.timeSlot);
  const [selectedService, setSelectedService] = useState(
    typeof booking.service === "object" ? booking.service._id : booking.service
  );

  const [bookedSlots, setBookedSlots] = useState([]);
  const [lockedSlots, setLockedSlots] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);

  const [lockExpiresAt, setLockExpiresAt] = useState(null);
  const [timer, setTimer] = useState(0);

  const [closedDays, setClosedDays] = useState([]);
  const [loading, setLoading] = useState(false);
const [timeSlots, setTimeSlots] = useState([]);


  // Format date to YYYY-MM-DD
  const fmt = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  };

  // Tomorrow min date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Fetch available services (only available: true)
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get("/services");
        // Filter only available services
        const available = res.data.filter((service) => service.available === true);
        setAvailableServices(available);
      } catch (error) {
        console.error("Error fetching services:", error);
        toast.error("Failed to load services");
      }
    };

    fetchServices();
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
useEffect(() => {
  if (!date) return;

  const fetchTimeSlots = async () => {
    try {
      const res = await api.get("/time-slots", {
        params: { date: fmt(date) },
      });

      setTimeSlots(res.data.slots || []);
    } catch (err) {
      toast.error("Failed to load time slots");
      setTimeSlots([]);
    }
  };

  fetchTimeSlots();
}, [date]);
  // Fetch booked + locked slots
  useEffect(() => {
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

  // Lock slot (TTL)
  const lockSlot = async (slot) => {
    if (!selectedService) {
      toast.error("Please select a service first");
      return;
    }

    try {
      const res = await api.post("/booking/lock-slot", {
        service: selectedService,
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

  // Update booking
  const handleUpdate = async () => {
    if (!timeSlot) {
      toast.error("Please select a time slot");
      return;
    }

    if (!selectedService) {
      toast.error("Please select a service");
      return;
    }

    setLoading(true);
    try {
      await api.patch(`/booking/${booking._id}`, {
        service: selectedService,
        date: fmt(date),
        timeSlot,
      });

      toast.success("✅ Booking updated successfully");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update booking");
    } finally {
      setLoading(false);
    }
  };

  // Check booked slot (allow current booking slot)
  const isBooked = (slot) => {
    const isSameDate = fmt(date) === fmt(new Date(booking.date));
    if (isSameDate && slot === booking.timeSlot) return false;

    return bookedSlots
      .map((s) => s.toLowerCase())
      .includes(slot.toLowerCase());
  };

  // Check locked slot (allow current booking slot)
  const isLocked = (slot) => {
    const isSameDate = fmt(date) === fmt(new Date(booking.date));
    if (isSameDate && slot === booking.timeSlot) return false;

    return lockedSlots
      .map((s) => s.toLowerCase())
      .includes(slot.toLowerCase());
  };

  // Get available time slots for dropdown
  const getAvailableSlots = () => {
    return timeSlots.filter((slot) => {
      const isSameDate = fmt(date) === fmt(new Date(booking.date));
      // Current slot is always available
      if (isSameDate && slot === booking.timeSlot) return true;

      const booked = bookedSlots
        .map((s) => s.toLowerCase())
        .includes(slot.toLowerCase());
      const locked = lockedSlots
        .map((s) => s.toLowerCase())
        .includes(slot.toLowerCase());

      return !booked && !locked;
    });
  };

  // Filter closed days
  const allowDate = (d) => !closedDays.includes(fmt(d));

  const availableTimeSlots = getAvailableSlots();
  const currentServiceName =
    typeof booking.service === "object"
      ? booking.service.name
      : availableServices.find((s) => s._id === booking.service)?.name || "N/A";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-pink-600">Edit Booking</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Current Booking */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm space-y-1">
          <p className="text-gray-600">
            <span className="font-medium">Current Service:</span>{" "}
            {currentServiceName}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Current Date & Time:</span>{" "}
            {new Date(booking.date).toLocaleDateString()} at{" "}
            {booking.timeSlot}
          </p>
        </div>

        {/* Service Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Select Service <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedService}
            onChange={(e) => {
              setSelectedService(e.target.value);
              // Reset time slot when service changes
              setTimeSlot("");
              setLockExpiresAt(null);
              setTimer(0);
            }}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="">-- Select a Service --</option>
            {availableServices.map((service) => (
              <option key={service._id} value={service._id}>
                {service.name} - ₹{service.price} ({service.duration})
              </option>
            ))}
          </select>
          {availableServices.length === 0 && (
            <p className="text-sm text-red-500 mt-1">
              ⚠️ No services available at the moment
            </p>
          )}
        </div>

        {/* Date Picker */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Select Date <span className="text-red-500">*</span>
          </label>
          <DatePicker
            selected={date}
            onChange={(d) => {
              setDate(d);
              setTimeSlot("");
              setLockExpiresAt(null);
              setTimer(0);
            }}
            minDate={tomorrow}
            filterDate={allowDate}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            dateFormat="MMMM d, yyyy"
          />
        </div>

        {/* Time Slot Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Available Time Slots <span className="text-red-500">*</span>
          </label>
          <select
            value={timeSlot}
            onChange={(e) => lockSlot(e.target.value)}
            disabled={!selectedService}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">
              {!selectedService
                ? "Select a service first"
                : "-- Select Time Slot --"}
            </option>
            {availableTimeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
                {fmt(date) === fmt(new Date(booking.date)) &&
                slot === booking.timeSlot
                  ? " (Current)"
                  : ""}
              </option>
            ))}
          </select>

          {selectedService && availableTimeSlots.length === 0 && (
            <p className="text-sm text-red-500 mt-1">
              ⚠️ No slots available for this date
            </p>
          )}

          {selectedService && availableTimeSlots.length > 0 && (
            <p className="text-sm text-green-600 mt-1">
              ✓ {availableTimeSlots.length} slot
              {availableTimeSlots.length !== 1 ? "s" : ""} available
            </p>
          )}
        </div>

        {/* Timer */}
        {timer > 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-center text-red-600 text-sm font-medium">
              ⏳ Slot locked. Time remaining: {Math.floor(timer / 60)}:
              {String(timer % 60).padStart(2, "0")}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={
              loading ||
              !timeSlot ||
              !selectedService ||
              availableTimeSlots.length === 0
            }
            className="flex-1 bg-pink-500 text-white py-2.5 rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
          >
            {loading ? "Updating..." : "Update Booking"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBookingModal;