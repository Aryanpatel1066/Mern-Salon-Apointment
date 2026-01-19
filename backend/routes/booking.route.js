const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.controller");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const Booking = require("../models/Booking.model");

// User Routes
router.post("/", authMiddleware, bookingController.createBooking);
router.get("/user/:userId", authMiddleware, bookingController.getBookingsByUser);

// Admin Routes
router.delete("/:id", authMiddleware, bookingController.deleteBooking);
router.get("/", authMiddleware, isAdmin, bookingController.getAllBookings);
router.patch("/:id/status", authMiddleware, isAdmin, bookingController.updateBookingStatus);

// Get Booked Slots for a Specific Date
 
router.get(
  "/booked-slots",
  authMiddleware,
  bookingController.getBookedSlots
);

router.get("/admin/bookingCount",authMiddleware,bookingController.countBooking)
module.exports = router;
