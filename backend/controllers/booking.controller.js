const mongoose = require("mongoose");
const Booking = require("../models/Booking.model");
const User = require("../models/User.model");
const Service = require("../models/Service.model");
const { transporter } = require("../utils/sendEmail");
const Notification = require("../models/Notification.model");
const SlotLock = require("../models/SlotLock.model");
const STATIC_LOCATION = "382860 city:vijapur house number 123"; // Or use process.env.SALON_LOCATION
let notificationMessage = "";

//creat bookin (user)
exports.createBooking = async (req, res) => {
  try {
    const { service, date, timeSlot } = req.body;
    const user = req.user.id;

    // ✅ Must have lock
    const lock = await SlotLock.findOne({ user, date, timeSlot });
    if (!lock) {
      return res.status(403).json({ message: "Slot not locked or expired" });
    }
    const existingService = await Service.findById(service);
    if (!existingService) {
      return res.status(404).json({ message: "Service not found" });
    }

    // ❗Check for time conflict
    const existingBooking = await Booking.findOne({ date, timeSlot });
    if (existingBooking) {
      return res.status(409).json({ message: "Selected time slot is already booked" });
    }

    const booking = new Booking({ user, service, date, timeSlot });
    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name email')
      .populate('service', 'name description');

    // 🔓 Remove lock
    await SlotLock.deleteOne({ _id: lock._id });

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: "Error creating booking", error: error.message });
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

// get all booking (user Id )
exports.getBookingsByUser = async (req, res) => {
  try {
    console.log("Received Params:", req.params);

    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID is missing in request" });
    }

    console.log("Fetching bookings for user:", userId);

    const bookings = await Booking.find({ user: new mongoose.Types.ObjectId(userId) })
      .populate("user service");

    if (bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for this user" });
    }


    const sanitizedBookings = bookings.map(booking => {
      const user = { ...booking.user._doc };
      delete user.password;
      return { ...booking._doc, user };
    });

    res.status(200).json(sanitizedBookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ message: "Error fetching bookings", error });
  }
};

// Update a booking (User can update only their own, Admin can update any)
// exports.updateBooking = async (req, res) => {
//     try {
//         const booking = await Booking.findById(req.params.id);
//         if (!booking) return res.status(404).json({ message: "Booking not found" });

//         // User can update only their own booking
//         if (req.user.role !== "admin" && booking.user.toString() !== req.user.id) {
//             return res.status(403).json({ message: "Unauthorized" });
//         }

//         Object.assign(booking, req.body);
//         await booking.save();
//         res.status(200).json(booking);
//     } catch (error) {
//         res.status(500).json({ message: "Error updating booking", error });
//     }
// };




//admin update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can update booking status" });
    }

    const booking = await Booking.findById(req.params.id).populate("user").populate("service");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = req.body.status;
    await booking.save();

    // Send email based on status
    const { email, name } = booking.user;
    const { name: serviceName } = booking.service;

    const timeZone = "Asia/Kolkata";


    const bookingDate = new Date(booking.date);

    const date = new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone,
    }).format(bookingDate);


    const time = booking.timeSlot;


    let subject, text;

    if (booking.status === "confirmed") {
      notificationMessage = `Your booking for "${serviceName}" on ${date} at ${time} has been confirmed.`;

      subject = "Your Booking is Confirmed!";
      text = `Hi ${name || "User"},\n
      \nYour booking for "${serviceName}" has been confirmed.\n
      \n📅 Date: ${date}\n⏰ Time: ${time}
      \n📍 Location: ${STATIC_LOCATION}\n
      \n✅ Check your status in your profile
      \n💫"Time is Money so please come on time , without someone else on your sloat"
      \nThank you for booking with us!\n
      \nSalonBlis App Team`;
    } else if (booking.status === "cancelled") {
      notificationMessage = `Your booking for "${serviceName}" on ${date} at ${time} has been cancelled.`;

      subject = "Your Booking Has Been Cancelled";
      text = `Hi ${name || "User"},\n
      \nYour booking for "${serviceName}" on 📅${date} at⏰ ${time} has been cancelled.\n
      \nIf this was unexpected, please reach out to our support team.\n
      \nSalonBlis App Team`;
    }
    // Save Notification
    if (notificationMessage) {
      await Notification.create({
        user: booking.user._id,
        message: notificationMessage
      });
    }

    //send mail
    if (subject && text) {
      await transporter.sendMail({
from: `"Salon App Support" <aryan.dev1066@gmail.com>`,
        to: email,
        subject,
        text,
      });
    }


    res.status(200).json({ message: "Booking status updated and email sent", booking });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ message: "Error updating booking status", error });
  }
};

// Delete a booking ADmin only
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

//cont booking
exports.countBooking = async (req, res) => {
  try {
    const bookingCount = await Booking.countDocuments();
    res.json({
      count: bookingCount
    })
  }
  catch (err) {
    res.status(500).json({
      message: "faild to count booking"
    })
  }
}
//disable allredy book and locking sloat
exports.getBookedSlots = async (req, res) => {
  const { date } = req.query;
  const userId = req.user?.id;
  const bookings = await Booking.find({ date }).select("timeSlot");
  const locks = await SlotLock.find({ date, user: { $ne: userId } }).select("timeSlot");

  const bookedSlots = bookings.map(b => b.timeSlot);
  const lockedSlots = locks.map(l => l.timeSlot);

  res.json({
    bookedSlots,
    lockedSlots,
  });
};