//This stores salon services like Haircut, Spa, Facial, etc.
const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    duration: { type: Number, required: true }, // Duration in minutes
    available: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Service", serviceSchema);
