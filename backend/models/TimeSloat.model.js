const mongoose = require("mongoose");

// Schema for date-specific slots
const DateSpecificSlotSchema = new mongoose.Schema({
  date: {
    type: String, // Format: "YYYY-MM-DD"
    required: true,
    unique: true,
  },
  slots: {
    type: [String],
    required: true,
  },
});

// Schema for default slots
const TimeSlotSchema = new mongoose.Schema(
  {
    slots: {
      type: [String],
      required: true,
      default: [
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
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const TimeSlot = mongoose.model("TimeSlot", TimeSlotSchema);
const DateSpecificSlot = mongoose.model("DateSpecificSlot", DateSpecificSlotSchema);

module.exports = { TimeSlot, DateSpecificSlot };