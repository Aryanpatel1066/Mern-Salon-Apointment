const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.controller");
const {authMiddleware ,isAdmin} = require("../middleware/authMiddleware");
 
// User Routes
router.post("/", authMiddleware, bookingController.createBooking);
router.get("/user/:userId",authMiddleware,bookingController.getBookingsByUser)
router.put("/:id", authMiddleware, bookingController.updateBooking);
router.delete("/:id", authMiddleware, bookingController.deleteBooking);

// Admin Routes
router.get("/", authMiddleware, isAdmin, bookingController.getAllBookings);
router.patch("/:id/status", authMiddleware, isAdmin, bookingController.updateBookingStatus);

module.exports = router;
