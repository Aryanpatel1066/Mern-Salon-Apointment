const mongoose = require("mongoose");

const ClosedDaySchema = new mongoose.Schema({
  date: {
    type: String, 
    required: true,
    unique: true,
  }
}, { timestamps: true });

module.exports = mongoose.model("ClosedDay", ClosedDaySchema);
