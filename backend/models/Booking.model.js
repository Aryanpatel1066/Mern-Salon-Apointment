//Tracks appointments for customers.
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true }, // Example: "10:30 AM"
    status: { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending" },
    paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
