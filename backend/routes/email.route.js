const express = require("express");
const router = express.Router();
const {
  sendOTP,
  verifyOTP,
  resetPassword,
} = require("../utils/sendEmail");

// Route: Send OTP
router.post("/send-otp", sendOTP);

// Route: Verify OTP
router.post("/verify-otp", verifyOTP);

// Route: Reset Password
router.post("/reset-password", resetPassword);

module.exports = router;
