const Booking = require("../models/Booking.model");
const User = require("../models/User.model");
const Service = require("../models/Service.model");

// Create a new booking (User only)
exports.createBooking = async (req, res) => {
    try {
        const { service, date, timeSlot } = req.body;
        const user = req.user.id; // Get logged-in user ID

        const existingService = await Service.findById(service);
        if (!existingService) {
            return res.status(404).json({ message: "Service not found" });
        }

        const booking = new Booking({ user, service, date, timeSlot });
        await booking.save();
        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: "Error creating booking", error });
    }
};

// Get all bookings (Admin only)
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate("user service");
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bookings", error });
    }
};

// Get a single booking by ID (User & Admin)
exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate("user service");
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        // Only allow user to see their booking, or admin can see all
        if (req.user.role !== "admin" && booking.user._id.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: "Error fetching booking", error });
    }
};

// Update a booking (User can update only their own, Admin can update any)
exports.updateBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        // User can update only their own booking
        if (req.user.role !== "admin" && booking.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        Object.assign(booking, req.body);
        await booking.save();
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: "Error updating booking", error });
    }
};

// Update booking status (Admin only)
exports.updateBookingStatus = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Only admins can update booking status" });
        }

        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        booking.status = req.body.status;
        await booking.save();
        res.status(200).json({ message: "Booking status updated", booking });
    } catch (error) {
        res.status(500).json({ message: "Error updating booking status", error });
    }
};

// Delete a booking (User can delete only their own, Admin can delete any)
exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        // User can delete only their own booking
        if (req.user.role !== "admin" && booking.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await booking.deleteOne();
        res.status(200).json({ message: "Booking deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting booking", error });
    }
};
