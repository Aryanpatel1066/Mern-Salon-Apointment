const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.controller");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const Booking = require("../models/Booking.model");

router.get("/booked-slots", authMiddleware, bookingController.getBookedSlots);
 
// User Routes
router.post("/", authMiddleware, bookingController.createBooking);
router.get("/user/:userId", authMiddleware, bookingController.getBookingsByUser);

//admin route 
router.patch("/:id/status", authMiddleware, isAdmin, bookingController.updateBookingStatus);

// ✅ User can update their own pending bookings
router.patch("/:id", authMiddleware, bookingController.updateBooking);
router.delete("/:id", authMiddleware, bookingController.deleteBooking);

// Admin get all bookings
router.get("/", authMiddleware, isAdmin, bookingController.getAllBookings);

// Add these NEW routes for analytics (put them BEFORE the generic routes)
router.get("/analytics/trends", authMiddleware, isAdmin, bookingController.getBookingAnalytics);
router.get("/analytics/popular-services", authMiddleware, isAdmin, bookingController.getPopularServices);
router.get("/analytics/status-distribution", authMiddleware, isAdmin, bookingController.getStatusDistribution);
router.get("/analytics/peak-hours", authMiddleware, isAdmin, bookingController.getPeakHours);
router.get("/analytics/dashboard-summary", authMiddleware, isAdmin, bookingController.getDashboardSummary);

module.exports = router;