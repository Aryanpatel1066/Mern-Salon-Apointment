import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../api/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmDialog from "../components/ConfirmDailog";

const AdminTimeSlots = () => {
  // Default slots management
  const [defaultSlots, setDefaultSlots] = useState([]);
  const [newDefaultSlot, setNewDefaultSlot] = useState("");
  const [loadingDefault, setLoadingDefault] = useState(false);

  // Date-specific slots management
  const [selectedDate, setSelectedDate] = useState(null);
  const [customSlots, setCustomSlots] = useState([]);
  const [newCustomSlot, setNewCustomSlot] = useState("");
  const [loadingCustom, setLoadingCustom] = useState(false);

  // All date-specific slots
  const [allDateSlots, setAllDateSlots] = useState([]);
  
  // Confirm dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    title: "",
    message: "",
    confirmText: "Confirm",
    loading: false,
    onConfirm: () => {},
  });

  // Format date to YYYY-MM-DD
  const fmt = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  };

  // Open confirm dialog helper
  const openConfirm = ({ title, message, confirmText = "Confirm", onConfirm }) => {
    setConfirmConfig({ title, message, confirmText, loading: false, onConfirm });
    setConfirmOpen(true);
  };

  // Close confirm dialog
  const closeConfirm = () => {
    setConfirmOpen(false);
    setConfirmConfig({
      title: "",
      message: "",
      confirmText: "Confirm",
      loading: false,
      onConfirm: () => {},
    });
  };

  // Fetch default slots
  useEffect(() => {
    fetchDefaultSlots();
    fetchAllDateSlots();
  }, []);

  const fetchDefaultSlots = async () => {
    try {
      const res = await api.get("/time-slots");
      setDefaultSlots(res.data.slots || []);
    } catch (error) {
      toast.error("Failed to load default slots");
    }
  };

  const fetchAllDateSlots = async () => {
    try {
      const res = await api.get("/time-slots/date-specific");
      setAllDateSlots(res.data || []);
    } catch (error) {
      console.error("Failed to load date-specific slots:", error);
    }
  };

  // Fetch slots for selected date
  useEffect(() => {
    if (selectedDate) {
      fetchSlotsForDate();
    }
  }, [selectedDate]);

  const fetchSlotsForDate = async () => {
    try {
      const res = await api.get("/time-slots", {
        params: { date: fmt(selectedDate) },
      });

      if (res.data.isCustom) {
        setCustomSlots(res.data.slots);
      } else {
        setCustomSlots([...defaultSlots]);
      }
    } catch (error) {
      setCustomSlots([...defaultSlots]);
    }
  };

  // ========== DEFAULT SLOTS HANDLERS ==========
  const handleAddDefaultSlot = () => {
    if (newDefaultSlot.trim()) {
      setDefaultSlots([...defaultSlots, newDefaultSlot.trim()]);
      setNewDefaultSlot("");
    }
  };

  const handleRemoveDefaultSlot = (index) => {
    setDefaultSlots(defaultSlots.filter((_, i) => i !== index));
  };

  const handleSaveDefaultSlots = async () => {
    if (defaultSlots.length === 0) {
      toast.error("At least one time slot is required");
      return;
    }

    setLoadingDefault(true);
    try {
      await api.put("/time-slots/default", { slots: defaultSlots });
      toast.success("✅ Default time slots updated");
      fetchDefaultSlots();
    } catch (error) {
      toast.error("Failed to update default slots");
    } finally {
      setLoadingDefault(false);
    }
  };

  const handleResetDefaultSlots = () => {
    openConfirm({
      title: "Reset Default Slots",
      message: "This will reset all default slots to system defaults. Continue?",
      confirmText: "Reset",
      onConfirm: async () => {
        setConfirmConfig((prev) => ({ ...prev, loading: true }));
        try {
          const res = await api.post("/time-slots/default/reset");
          setDefaultSlots(res.data.slots);
          toast.success("✅ Default slots reset");
          closeConfirm();
        } catch (error) {
          toast.error("Failed to reset default slots");
          setConfirmConfig((prev) => ({ ...prev, loading: false }));
        }
      },
    });
  };

  // ========== DATE-SPECIFIC SLOTS HANDLERS ==========
  const handleAddCustomSlot = () => {
    if (newCustomSlot.trim()) {
      setCustomSlots([...customSlots, newCustomSlot.trim()]);
      setNewCustomSlot("");
    }
  };

  const handleRemoveCustomSlot = (index) => {
    setCustomSlots(customSlots.filter((_, i) => i !== index));
  };

  const handleSaveCustomSlots = async () => {
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }

    if (customSlots.length === 0) {
      toast.error("At least one time slot is required");
      return;
    }

    setLoadingCustom(true);
    try {
      await api.post("/time-slots/date-specific", {
        date: fmt(selectedDate),
        slots: customSlots,
      });
      toast.success(`✅ Custom slots saved for ${fmt(selectedDate)}`);
      fetchAllDateSlots();
    } catch (error) {
      toast.error("Failed to save custom slots");
    } finally {
      setLoadingCustom(false);
    }
  };

  const handleDeleteDateSlots = (date) => {
    openConfirm({
      title: "Delete Custom Slots",
      message: `Are you sure you want to remove all custom slots for ${date}?`,
      confirmText: "Delete",
      onConfirm: async () => {
        setConfirmConfig((prev) => ({ ...prev, loading: true }));
        try {
          await api.delete(`/time-slots/date-specific/${date}`);
          toast.success("✅ Custom slots removed");
          fetchAllDateSlots();

          if (selectedDate && fmt(selectedDate) === date) {
            setCustomSlots([...defaultSlots]);
          }
          closeConfirm();
        } catch (error) {
          toast.error("Failed to remove custom slots");
          setConfirmConfig((prev) => ({ ...prev, loading: false }));
        }
      },
    });
  };

  const handleLoadDefaultTemplate = () => {
    setCustomSlots([...defaultSlots]);
    toast.info("Default slots loaded as template");
  };

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      <ToastContainer position="top-center" />

      <h1 className="text-3xl font-bold text-pink-600">Time Slots Management</h1>

      {/* DEFAULT SLOTS SECTION */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Default Time Slots
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          These slots will be used for all dates unless custom slots are set
        </p>

        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={newDefaultSlot}
            onChange={(e) => setNewDefaultSlot(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddDefaultSlot()}
            placeholder="e.g., 7AM to 8AM"
            className="flex-1 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
          <button
            onClick={handleAddDefaultSlot}
            className="px-6 py-2.5 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition font-medium"
          >
            Add Slot
          </button>
        </div>

        <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
          {defaultSlots.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No default slots configured</p>
          ) : (
            defaultSlots.map((slot, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <span className="font-medium text-gray-700">{slot}</span>
                <button
                  onClick={() => handleRemoveDefaultSlot(index)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm transition"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSaveDefaultSlots}
            disabled={loadingDefault || defaultSlots.length === 0}
            className="px-6 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
          >
            {loadingDefault ? "Saving..." : "Save Default Slots"}
          </button>
          <button
            onClick={handleResetDefaultSlots}
            disabled={loadingDefault}
            className="px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-medium"
          >
            Reset to System Default
          </button>
        </div>
      </div>

      {/* DATE-SPECIFIC SLOTS SECTION */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Date-Specific Time Slots
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Set custom slots for specific dates (overrides default slots)
        </p>

        {/* Date Picker */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Select Date
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            minDate={new Date()}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            dateFormat="MMMM d, yyyy"
            placeholderText="Choose a date to customize"
          />
        </div>

        {selectedDate && (
          <>
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Editing slots for:</strong> {fmt(selectedDate)}
              </p>
              <button
                onClick={handleLoadDefaultTemplate}
                className="mt-2 text-xs text-blue-600 hover:underline font-medium"
              >
                📋 Load default slots as template
              </button>
            </div>

            <div className="mb-4 flex gap-2">
              <input
                type="text"
                value={newCustomSlot}
                onChange={(e) => setNewCustomSlot(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddCustomSlot()}
                placeholder="e.g., 9AM to 10AM"
                className="flex-1 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <button
                onClick={handleAddCustomSlot}
                className="px-6 py-2.5 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition font-medium"
              >
                Add Slot
              </button>
            </div>

            <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
              {customSlots.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No slots added yet</p>
              ) : (
                customSlots.map((slot, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <span className="font-medium text-gray-700">{slot}</span>
                    <button
                      onClick={() => handleRemoveCustomSlot(index)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm transition"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={handleSaveCustomSlots}
              disabled={loadingCustom || customSlots.length === 0}
              className="px-6 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
            >
              {loadingCustom ? "Saving..." : `Save Slots for ${fmt(selectedDate)}`}
            </button>
          </>
        )}
      </div>

      {/* ALL DATE-SPECIFIC SLOTS */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          All Custom Date Slots
        </h2>

        {allDateSlots.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No custom date slots configured yet
          </p>
        ) : (
          <div className="space-y-3">
            {allDateSlots.map((item) => (
              <div
                key={item.date}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-pink-300 transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-800">
                    {new Date(item.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </h3>
                  <button
                    onClick={() => handleDeleteDateSlots(item.date)}
                    className="px-4 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 text-sm transition font-medium"
                  >
                    Delete
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.slots.map((slot, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium"
                    >
                      {slot}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        loading={confirmConfig.loading}
        onCancel={closeConfirm}
        onConfirm={confirmConfig.onConfirm}
      />
    </div>
  );
};

export default AdminTimeSlots;