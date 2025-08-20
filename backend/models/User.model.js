const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
      phone: { 
      type: String, 
      required: false, 
      unique: true, 
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"] 
    },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
    otp: { type: String },
    otpExpires: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
