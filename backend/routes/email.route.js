const express = require("express");
const router = express.Router();
const {
  sendOTP,
  verifyOTP,
  resetPassword,
  resendOTP
} = require("../utils/sendEmail");
const rateLimiter = require("../middleware/rateLimiter");

// Route: Send OTP
router.post("/send-otp", rateLimiter({
    keyPrefix: "otp",
    limit: 5,
    windowMs: 5 * 60 * 1000 // 5 minutes
  }), sendOTP);

// Route: Verify OTP
router.post("/verify-otp", verifyOTP);

// Route: Reset Password
router.post("/reset-password", resetPassword);

//Route: Resend OTP
router.post("/resend-otp", resendOTP);

module.exports = router;
 