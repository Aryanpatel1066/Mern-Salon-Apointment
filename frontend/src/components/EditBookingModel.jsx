import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../api/api";
import { toast } from "react-toastify";
import useClosedDays from "../hooks/useClosedDays";
import useTimeSlots from "../hooks/useTimeSlots";
import useSlotLock from "../hooks/useSlotLock";
import useServices from "../hooks/useServices";
import { formatDate } from "../utils/dateUtils";
import { useNavigate } from "react-router-dom";

const EditBookingModal = ({ booking, onClose, onSuccess }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [date, setDate] = useState(new Date(booking.date));
  const [selectedService, setSelectedService] = useState(
    typeof booking.service === "object" ? booking.service._id : booking.service,
  );

  const [dateChanged, setDateChanged] = useState(false);
  const [slotChanged, setSlotChanged] = useState(false);

  const { allowDate } = useClosedDays();

  const { services: availableServices, loading } = useServices({
    onlyAvailable: true,
  });

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

  const handleServiceChange = (e) => {
    setSelectedService(e.target.value);
    // DO NOT clear slot
  };

  const handleDateChange = (d) => {
    setDate(d);
    setDateChanged(true);
    clearLock(); // force new slot
  };

  const handleSlotClick = (slot) => {
    if (isBooked(slot) || isLocked(slot)) return;
    lockSlot(slot);
    setSlotChanged(true);
  };

  const handleUpdate = async () => {
    const finalTimeSlot =
      dateChanged || slotChanged ? timeSlot : booking.timeSlot;

    if (!selectedService) {
      toast.error("❌ Please select a service");
      return;
    }

    if (!finalTimeSlot) {
      toast.error("❌ Please select a time slot");
      return;
    }

    try {
      await api.patch(`/booking/${booking._id}`, {
        service: selectedService,
        date: formatDate(date),
        timeSlot: finalTimeSlot,
      });

      clearLock();
      toast.success("✅ Booking updated successfully");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update booking");
    }
  };

  const availableTimeSlots = timeSlots.filter((slot) => {
    if (
      slot === booking.timeSlot &&
      formatDate(date) === formatDate(new Date(booking.date))
    ) {
      return true;
    }
    return !isBooked(slot) && !isLocked(slot);
  });

  const currentServiceName =
    typeof booking.service === "object"
      ? booking.service.name
      : availableServices.find((s) => s._id === booking.service)?.name || "N/A";

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
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
            {new Date(booking.date).toLocaleDateString()} at {booking.timeSlot}
          </p>
        </div>

        {/* Service */}
        <select
          value={selectedService}
          onChange={handleServiceChange}
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
          className="w-full p-2 mb-4 border rounded"
        />

        {/* Slots */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {timeSlots.map((slot) => {
            const selected =
              slot ===
              (slotChanged || dateChanged ? timeSlot : booking.timeSlot);

            return (
              <button
                key={slot}
                disabled={isBooked(slot) || isLocked(slot)}
                onClick={() => handleSlotClick(slot)}
                className={`p-2 border rounded ${
                  selected
                    ? "bg-pink-500 text-white"
                    : isBooked(slot)
                      ? "bg-gray-400 text-white"
                      : isLocked(slot)
                        ? "bg-yellow-300"
                        : "bg-green-100"
                }`}
              >
                {slot}
              </button>
            );
          })}
        </div>

        {/* Timer */}
        {timer > 0 && (
          <p className="text-center text-red-500 text-sm mb-3">
            ⏳ Time left: {Math.floor(timer / 60)}:
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
            className="flex-1 bg-pink-500 text-white py-2 rounded"
          >
            Update Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBookingModal;
