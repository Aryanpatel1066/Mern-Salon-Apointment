const dotenv = require("dotenv");
dotenv.config();

const bcrypt = require("bcryptjs");
const sgMail = require("@sendgrid/mail");

const User = require("../models/User.model");
const { generateOTP, hashOTP } = require("../helpers/otp.helper.js");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/* ----------------------------------
   Helper: Send OTP Email
----------------------------------- */
const sendOtpMail = async (email, otp, name = "User") => {
  await sgMail.send({
    to: email,
    from: "aryan.dev1066@gmail.com", // MUST be verified in SendGrid
    subject: "Your OTP for Password Reset",
    html: `
      <div style="font-family: Arial, sans-serif">
        <h3>Hello ${name},</h3>
        <p>Your OTP for password reset is:</p>
        <h2 style="letter-spacing:2px">${otp}</h2>
        <p>This OTP will expire in <b>10 minutes</b>.</p>
        <p>If you didn’t request this, please ignore this email.</p>
      </div>
    `,
  });
};

/* ----------------------------------
   SEND OTP
----------------------------------- */
exports.sendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();

    user.otp = hashOTP(otp);
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();

    await sendOtpMail(email, otp, user.name);

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

/* ----------------------------------
   RESEND OTP (with cooldown)
----------------------------------- */
exports.resendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    // ⏳ 2-minute cooldown
    if (user.otpExpires && user.otpExpires - Date.now() > 8 * 60 * 1000) {
      return res
        .status(429)
        .json({ message: "Please wait before resending OTP" });
    }

    const otp = generateOTP();

    user.otp = hashOTP(otp);
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendOtpMail(email, otp, user.name);

    res.json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ message: "Failed to resend OTP" });
  }
};

/* ----------------------------------
   VERIFY OTP
----------------------------------- */
exports.verifyOTP = async (req, res) => {
  const { otp } = req.body;

  if (!otp)
    return res.status(400).json({ message: "OTP is required" });

  try {
    const hashedOtp = hashOTP(otp);

    const user = await User.findOne({
      otp: hashedOtp,
      otpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.json({ message: "OTP verified" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

/* ----------------------------------
   RESET PASSWORD
----------------------------------- */
exports.resetPassword = async (req, res) => {
  const { otp, newPassword } = req.body;

  if (!otp || !newPassword)
    return res
      .status(400)
      .json({ message: "OTP and new password are required" });

  try {
    const hashedOtp = hashOTP(otp);

    const user = await User.findOne({
      otp: hashedOtp,
      otpExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    user.password = bcrypt.hashSync(newPassword, 10);
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Password reset failed" });
  }
};
