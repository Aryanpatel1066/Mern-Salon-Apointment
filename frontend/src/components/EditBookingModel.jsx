import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../api/api";
import { toast } from "react-toastify";
import useClosedDays from "../hooks/useClosedDays";
import useTimeSlots from "../hooks/useTimeSlots";
import useSlotLock from "../hooks/useSlotLock";
import useAvailableServices from "../hooks/useAvailableServices";
import { formatDate } from "../utils/dateUtils";
import { useNavigate } from "react-router-dom";

const EditBookingModal = ({ booking, onClose, onSuccess }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [date, setDate] = useState(new Date(booking.date));
  const [selectedService, setSelectedService] = useState(
    typeof booking.service === "object"
      ? booking.service._id
      : booking.service,
  );

  const [dateChanged, setDateChanged] = useState(false);
  const [slotChanged, setSlotChanged] = useState(false);

  const { allowDate } = useClosedDays();
  const { services: availableServices, loading } = useAvailableServices();

  const { timeSlots, isBooked, isLocked } = useTimeSlots({
    date,
    token,
    navigate,
    ignoreSlot: booking.timeSlot,
    ignoreDate: formatDate(new Date(booking.date)),
  });

  const { timeSlot, timer, lockSlot, clearLock } = useSlotLock({
    date,
    serviceId: selectedService,
  });

  const handleDateChange = (d) => {
    setDate(d);
    setDateChanged(true);
    clearLock();
  };

  const handleSlotClick = (slot) => {
    if (isBooked(slot) || isLocked(slot)) return;
    lockSlot(slot);
    setSlotChanged(true);
  };

  const handleUpdate = async () => {
    const finalSlot =
      dateChanged || slotChanged ? timeSlot : booking.timeSlot;

    if (!selectedService) {
      toast.error("❌ Please select a service");
      return;
    }

    if (!finalSlot) {
      toast.error("❌ Please select a time slot");
      return;
    }

    try {
      await api.patch(`/booking/${booking._id}`, {
        service: selectedService,
        date: formatDate(date),
        timeSlot: finalSlot,
      });

      clearLock();
      toast.success("✅ Booking updated successfully");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  const currentServiceName =
    typeof booking.service === "object"
      ? booking.service.name
      : availableServices.find((s) => s._id === booking.service)?.name || "N/A";

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-pink-600">Edit Booking</h2>
          <button onClick={onClose} className="text-gray-500 text-2xl">
            ×
          </button>
        </div>

        {/* Current Info */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm">
          <p>
            <b>Current Service:</b> {currentServiceName}
          </p>
          <p>
            <b>Current Date & Time:</b>{" "}
            {new Date(booking.date).toLocaleDateString()} at{" "}
            {booking.timeSlot}
          </p>
        </div>

        {/* Service */}
        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="">-- Select Service --</option>
          {availableServices.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name} - ₹{s.price}
            </option>
          ))}
        </select>

        {/* Date */}
        <DatePicker
          selected={date}
          onChange={handleDateChange}
          minDate={tomorrow}
          filterDate={allowDate}
          dateFormat="dd MMM yyyy"
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
        />

         <div className="flex flex-wrap justify-center gap-3 text-xs mb-2">
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

        {/* Slots */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {timeSlots.map((slot) => {
            const booked = isBooked(slot);
            const locked = isLocked(slot);
            const selected =
              slot ===
              (slotChanged || dateChanged ? timeSlot : booking.timeSlot);

            return (
              <div
                key={slot}
                title={
                  booked
                    ? "This slot is already booked"
                    : locked
                    ? "Temporarily reserved by another user"
                    : selected
                    ? "Selected by you"
                    : "Click to select this slot"
                }
              >
                <button
                  disabled={booked || locked}
                  onClick={() => handleSlotClick(slot)}
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
                  {locked && !booked && (
                    <span className="absolute top-1 right-1 text-xs">⏳</span>
                  )}
                  {selected && (
                    <span className="absolute top-1 right-1 text-xs">✔</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Timer */}
        {timer > 0 && (
          <p className="text-center text-red-500 text-sm mb-3">
            ⏳ This slot is reserved for you for{" "}
            {Math.floor(timer / 60)}:
            {String(timer % 60).padStart(2, "0")}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border py-2 rounded">
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="flex-1 bg-pink-500 text-white py-2 rounded hover:bg-pink-600"
          >
            Update Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBookingModal;
