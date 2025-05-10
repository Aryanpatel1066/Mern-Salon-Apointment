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
router.get("/booked-slots", async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: "Date required" });

    // Create a Date object from the input date
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(startDate.getDate() + 1); // Set the end date to the next day

    // Query for bookings between start and end of the selected day
    const bookings = await Booking.find({
      date: { $gte: startDate, $lt: endDate }
    });

    const bookedSlots = bookings.map(b => b.timeSlot); // Get booked time slots for the date
    res.json({ bookedSlots }); // Send the booked slots back to the client
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch slots", error: error.message });
  }
});
router.get("/admin/bookingCount",authMiddleware,bookingController.countBooking)
module.exports = router;
