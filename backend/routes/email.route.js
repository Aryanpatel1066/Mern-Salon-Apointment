const express = require("express");
const router = express.Router();
const {
  sendOTP,
  verifyOTP,
  resetPassword,
  resendOTP
} = require("../utils/sendEmail");

// Route: Send OTP
router.post("/send-otp", sendOTP);

// Route: Verify OTP
router.post("/verify-otp", verifyOTP);

// Route: Reset Password
router.post("/reset-password", resetPassword);

//Route: Resend OTP
router.post("/resend-otp", resendOTP);

module.exports = router;
