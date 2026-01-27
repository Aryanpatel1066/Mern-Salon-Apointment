import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../api/api";

const useAdminTimeSlots = () => {
  // Default slots
  const [defaultSlots, setDefaultSlots] = useState([]);
  const [newDefaultSlot, setNewDefaultSlot] = useState("");
  const [loadingDefault, setLoadingDefault] = useState(false);

  // Date-specific slots
  const [selectedDate, setSelectedDate] = useState(null);
  const [customSlots, setCustomSlots] = useState([]);
  const [newCustomSlot, setNewCustomSlot] = useState("");
  const [loadingCustom, setLoadingCustom] = useState(false);

  // All date-specific slots
  const [allDateSlots, setAllDateSlots] = useState([]);

  // ---------- HELPERS ----------
  const fmt = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  };

  // ---------- FETCH ----------
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

  const fetchSlotsForDate = async () => {
    if (!selectedDate) return;

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

  useEffect(() => {
    fetchDefaultSlots();
    fetchAllDateSlots();
  }, []);

  useEffect(() => {
    fetchSlotsForDate();
  }, [selectedDate]);

  // ---------- DEFAULT SLOTS HANDLERS ----------
  const addDefaultSlot = () => {
    if (newDefaultSlot.trim()) {
      setDefaultSlots([...defaultSlots, newDefaultSlot.trim()]);
      setNewDefaultSlot("");
    }
  };

  const removeDefaultSlot = (index) => {
    setDefaultSlots(defaultSlots.filter((_, i) => i !== index));
  };

  const saveDefaultSlots = async () => {
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

  const resetDefaultSlots = async () => {
    setLoadingDefault(true);
    try {
      const res = await api.post("/time-slots/default/reset");
      setDefaultSlots(res.data.slots);
      toast.success("✅ Default slots reset");
    } catch (error) {
      toast.error("Failed to reset default slots");
    } finally {
      setLoadingDefault(false);
    }
  };

  // ---------- DATE-SPECIFIC HANDLERS ----------
  const addCustomSlot = () => {
    if (newCustomSlot.trim()) {
      setCustomSlots([...customSlots, newCustomSlot.trim()]);
      setNewCustomSlot("");
    }
  };

  const removeCustomSlot = (index) => {
    setCustomSlots(customSlots.filter((_, i) => i !== index));
  };

  const saveCustomSlots = async () => {
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

  const deleteDateSlots = async (date) => {
    setLoadingCustom(true);
    try {
      await api.delete(`/time-slots/date-specific/${date}`);
      toast.success("✅ Custom slots removed");
      fetchAllDateSlots();

      if (selectedDate && fmt(selectedDate) === date) {
        setCustomSlots([...defaultSlots]);
      }
    } catch (error) {
      toast.error("Failed to remove custom slots");
    } finally {
      setLoadingCustom(false);
    }
  };

  const loadDefaultTemplate = () => {
    setCustomSlots([...defaultSlots]);
    toast.info("Default slots loaded as template");
  };

  return {
    defaultSlots,
    newDefaultSlot,
    setNewDefaultSlot,
    loadingDefault,
    addDefaultSlot,
    removeDefaultSlot,
    saveDefaultSlots,
    resetDefaultSlots,

    selectedDate,
    setSelectedDate,
    customSlots,
    newCustomSlot,
    setNewCustomSlot,
    loadingCustom,
    addCustomSlot,
    removeCustomSlot,
    saveCustomSlots,
    deleteDateSlots,
    loadDefaultTemplate,

    allDateSlots,
    fmt,
  };
};

export default useAdminTimeSlots;
