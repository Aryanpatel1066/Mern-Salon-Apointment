const { TimeSlot, DateSpecificSlot } = require("../models/TimeSloat.model");

// Get time slots for a specific date (checks date-specific first, then default)
exports.getTimeSlots = async (req, res) => {
  try {
    const { date } = req.query; // Format: YYYY-MM-DD

    // If date is provided, check for date-specific slots first
    if (date) {
      const dateSpecificSlot = await DateSpecificSlot.findOne({ date });

      if (dateSpecificSlot) {
        return res.status(200).json({
          slots: dateSpecificSlot.slots,
          isCustom: true,
          date: date,
        });
      }
    }

    // Otherwise, return default slots
    let defaultSlots = await TimeSlot.findOne({ isActive: true });

    if (!defaultSlots) {
      defaultSlots = await TimeSlot.create({
        slots: [
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
        ],
        isActive: true,
      });
    }

    res.status(200).json({
      slots: defaultSlots.slots,
      isCustom: false,
    });
  } catch (error) {
    console.error("Error fetching time slots:", error);
    res.status(500).json({
      message: "Error fetching time slots",
      error: error.message
    });
  }
};

// Get all date-specific slots (Admin only)
exports.getAllDateSpecificSlots = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const dateSlots = await DateSpecificSlot.find().sort({ date: 1 });
    res.status(200).json(dateSlots);
  } catch (error) {
    console.error("Error fetching date-specific slots:", error);
    res.status(500).json({
      message: "Error fetching date-specific slots",
      error: error.message
    });
  }
};

// Update default time slots (Admin only)
exports.updateDefaultSlots = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { slots } = req.body;

    if (!slots || !Array.isArray(slots) || slots.length === 0) {
      return res.status(400).json({
        message: "Please provide valid time slots array"
      });
    }

    const validSlots = slots.every(
      slot => typeof slot === "string" && slot.trim().length > 0
    );

    if (!validSlots) {
      return res.status(400).json({
        message: "All time slots must be valid strings"
      });
    }

    let timeSlotConfig = await TimeSlot.findOne({ isActive: true });

    if (timeSlotConfig) {
      timeSlotConfig.slots = slots;
      await timeSlotConfig.save();
    } else {
      timeSlotConfig = await TimeSlot.create({
        slots,
        isActive: true,
      });
    }

    res.status(200).json({
      message: "Default time slots updated successfully",
      slots: timeSlotConfig.slots,
    });
  } catch (error) {
    console.error("Error updating default slots:", error);
    res.status(500).json({
      message: "Error updating default slots",
      error: error.message
    });
  }
};

// Set custom slots for a specific date (Admin only)
exports.setDateSpecificSlots = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { date, slots } = req.body;

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!date || !dateRegex.test(date)) {
      return res.status(400).json({
        message: "Please provide valid date in YYYY-MM-DD format"
      });
    }

    // Validate slots
    if (!slots || !Array.isArray(slots) || slots.length === 0) {
      return res.status(400).json({
        message: "Please provide valid time slots array"
      });
    }

    const validSlots = slots.every(
      slot => typeof slot === "string" && slot.trim().length > 0
    );

    if (!validSlots) {
      return res.status(400).json({
        message: "All time slots must be valid strings"
      });
    }

    // Update or create date-specific slot
    let dateSlot = await DateSpecificSlot.findOne({ date });

    if (dateSlot) {
      dateSlot.slots = slots;
      await dateSlot.save();
    } else {
      dateSlot = await DateSpecificSlot.create({ date, slots });
    }

    res.status(200).json({
      message: `Custom slots set for ${date}`,
      date: dateSlot.date,
      slots: dateSlot.slots,
    });
  } catch (error) {
    console.error("Error setting date-specific slots:", error);
    res.status(500).json({
      message: "Error setting date-specific slots",
      error: error.message
    });
  }
};

// Delete custom slots for a specific date (Admin only)
exports.deleteDateSpecificSlots = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { date } = req.params;

    const result = await DateSpecificSlot.findOneAndDelete({ date });

    if (!result) {
      return res.status(404).json({
        message: "No custom slots found for this date"
      });
    }

    res.status(200).json({
      message: `Custom slots removed for ${date}. Default slots will now be used.`,
    });
  } catch (error) {
    console.error("Error deleting date-specific slots:", error);
    res.status(500).json({
      message: "Error deleting date-specific slots",
      error: error.message
    });
  }
};

// Reset to default time slots (Admin only)
exports.resetDefaultSlots = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const defaultSlots = [
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

    let timeSlotConfig = await TimeSlot.findOne({ isActive: true });

    if (timeSlotConfig) {
      timeSlotConfig.slots = defaultSlots;
      await timeSlotConfig.save();
    } else {
      timeSlotConfig = await TimeSlot.create({
        slots: defaultSlots,
        isActive: true,
      });
    }

    res.status(200).json({
      message: "Default time slots reset",
      slots: timeSlotConfig.slots,
    });
  } catch (error) {
    console.error("Error resetting default slots:", error);
    res.status(500).json({
      message: "Error resetting default slots",
      error: error.message
    });
  }
};