const express = require("express");
const router = express.Router();

// Import all route modules
const authRoutes = require("./auth.route");
const serviceRoutes = require("./service.route");
const bookingRoutes = require("./booking.route");
const slotLockRoutes = require("./slotLock.route");
const closeDaysRoutes = require("./closeDays.route");
const emailRoutes = require("./email.route");
const notificationRoutes = require("./notification.route");
const timeSlotRoutes = require("./timeSloat.route");
const analyticsRoutes = require("./analytics.route");

// Register routes
router.use("/users", authRoutes);
router.use("/services", serviceRoutes);
router.use("/booking", bookingRoutes);
router.use("/", slotLockRoutes);
router.use("/closed-days", closeDaysRoutes);
router.use("/email", emailRoutes);
router.use("/notifications", notificationRoutes);
router.use("/", timeSlotRoutes);
router.use("/", analyticsRoutes);

module.exports = router;