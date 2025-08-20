const mongoose = require("mongoose");

const ClosedDaySchema = new mongoose.Schema({
  date: {
    type: String, // store as YYYY-MM-DD string for easy comparison
    required: true,
    unique: true,
  }
}, { timestamps: true });

module.exports = mongoose.model("ClosedDay", ClosedDaySchema);
