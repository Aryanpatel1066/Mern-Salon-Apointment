 require("dotenv").config();
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");

// Nodemailer transporter using environment variables
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP to user's email
const sendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 min expiry
    await user.save();

    await transporter.sendMail({
      from: `"Salon App Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP for Password Reset",
      text: `Hi ${user.name || "User"},\n\nYour OTP for password reset is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you did not request this, please ignore this email.\n\nRegards,\nSalon App Team`,
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  const { otp } = req.body;
console.log(otp)

  if (!otp) {
    return res.status(400).json({ message: "OTP is required" });
  }
  try {
    const user = await User.findOne({
      otp,
      otpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.status(200).json({ message: "OTP Verified" });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

// Reset password using OTP
const resetPassword = async (req, res) => {
  const { otp, newPassword } = req.body;

  if (!otp || !newPassword) {
    return res
      .status(400)
      .json({ message: "OTP and new password are required" });
  }

  try {
    const user = await User.findOne({
      otp,
      otpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(404).json({ message: "Invalid or expired OTP" });
    }

    user.password = bcrypt.hashSync(newPassword, 8);
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Password reset failed" });
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
  resetPassword,
};
