const mongoose = require("mongoose");
const Booking = require("../models/Booking.model");
const User = require("../models/User.model");
const Service = require("../models/Service.model");
const Notification = require("../models/Notification.model");
const SlotLock = require("../models/SlotLock.model");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const STATIC_LOCATION = "382860 city:vijapur house number 123"; 
let notificationMessage = "";

//creat bookin (user)
 
exports.createBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { service, date, timeSlot } = req.body;

    const DAILY_LIMIT = 5;

    // 🕛 Today range
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    // 🔢 Count today's bookings
    const todayCount = await Booking.countDocuments({
      user: userId,
      createdAt: { $gte: start, $lte: end }
    });

    if (todayCount >= DAILY_LIMIT) {
      return res.status(429).json({
        message: "Daily booking limit reached (5). Try again tomorrow."
      });
    }

    // ✅ Slot lock check (if you use it)
    const lock = await SlotLock.findOne({ user: userId, date, timeSlot });
    if (!lock) {
      return res.status(403).json({ message: "Slot not locked or expired" });
    }

    const booking = await Booking.create({
      user: userId,
      service,
      date,
      timeSlot
    });

    await SlotLock.deleteOne({ _id: lock._id });

    res.status(201).json({ message: "Booking confirmed", booking });
  } catch (error) {
    res.status(500).json({ message: "Booking failed" });
  }
};

exports.getBookingStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const DAILY_LIMIT = 5;

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const count = await Booking.countDocuments({
      user: userId,
      createdAt: { $gte: start, $lte: end }
    });

    res.json({
      canBook: count < DAILY_LIMIT,
      remaining: Math.max(0, DAILY_LIMIT - count)
    });
  } catch {
    res.status(500).json({ message: "Failed to check booking status" });
  }
};


 // Get all bookings (Admin only) with cursor pagination
exports.getAllBookings = async (req, res) => {
  try {
    let { limit = 10, cursor } = req.query;
    limit = parseInt(limit);

    const query = {};

    // If cursor exists, load next page
    if (cursor) {
      query._id = { $lt: cursor }; 
    }

    // Fetch one extra record to check hasMore
    const bookings = await Booking.find(query)
      .sort({ _id: -1 }) // newest first
      .limit(limit + 1)
      .populate("user service");

    const hasMore = bookings.length > limit;

    if (hasMore) bookings.pop(); // remove extra

    const nextCursor =
      bookings.length > 0
        ? bookings[bookings.length - 1]._id
        : null;

    res.status(200).json({
      data: bookings,
      nextCursor,
      hasMore,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching bookings",
      error: error.message,
    });
  }
};


// get all booking (user Id )
exports.getBookingsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 6, cursor } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is missing" });
    }

    const query = { user: userId };

    // cursor logic
    if (cursor) {
      query._id = { $lt: cursor };
    }

    const bookings = await Booking.find(query)
      .sort({ _id: -1 }) // newest first
      .limit(Number(limit) + 1)
      .populate("user service");

    let hasMore = false;

    if (bookings.length > limit) {
      hasMore = true;
      bookings.pop(); // remove extra one
    }

    const sanitizedBookings = bookings.map((booking) => {
      const user = booking.user?.toObject();
      if (user) delete user.password;

      return {
        ...booking.toObject(),
        user,
      };
    });

    const nextCursor =
      bookings.length > 0 ? bookings[bookings.length - 1]._id : null;

    res.status(200).json({
      data: sanitizedBookings,
      nextCursor,
      hasMore,
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};


// Update a booking (User can only update PENDING state)
exports.updateBooking = async (req, res) => {
  try {
    const { service, date, timeSlot } = req.body;
    const bookingId = req.params.id;
    const userId = req.user.id; 

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // ✅ Only allow editing if status is "pending"
    if (booking.status !== "pending") {
      console.log("❌ Status check failed:", booking.status);
      return res.status(403).json({
        message: "Only pending bookings can be edited"
      });
    }

    // ✅ Users can only edit their own bookings (Convert both to strings for comparison)
    //If the booking does NOT belong to this user AND the user is NOT an admin → block them
    if (booking.user.toString() !== userId.toString() && req.user.role !== "admin") {
      console.log("❌ Authorization failed");
      return res.status(403).json({
        message: "You can only edit your own bookings"
      });
    }

    // ✅ Format dates for comparison
    const formatDate = (d) => {
      const date = new Date(d);
      return date.toISOString().split('T')[0];
    };

    const oldDate = formatDate(booking.date);
    const newDate = formatDate(date);


    // Check if new slot is available (if date or time changed)
    if (date && timeSlot && (newDate !== oldDate || timeSlot !== booking.timeSlot)) {
      const conflict = await Booking.findOne({
        date: new Date(date),
        timeSlot,
        _id: { $ne: bookingId } // Exclude current booking
      });

      if (conflict) {
        console.log("⚠️ Slot conflict found");
        return res.status(409).json({
          message: "Selected time slot is already booked"
        });
      }
    }

    // Update booking
    if (service) booking.service = service; // Add this line
    if (date) booking.date = new Date(date);
    if (timeSlot) booking.timeSlot = timeSlot;

    await booking.save();

    const updated = await Booking.findById(bookingId)
      .populate('user', 'name email')
      .populate('service', 'name description price');

    console.log("✅ Booking updated successfully");
    res.status(200).json({
      message: "Booking updated successfully",
      booking: updated
    });
  } catch (error) {
    console.error("❌ Error updating booking:", error);
    res.status(500).json({
      message: "Error updating booking",
      error: error.message
    });
  }
};

//admin change booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can update booking status" });
    }

    const booking = await Booking.findById(req.params.id)
      .populate("user")
      .populate("service");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = req.body.status;
    await booking.save();

    const { email, name } = booking.user;
    const { name: serviceName } = booking.service;

    const timeZone = "Asia/Kolkata";
    const bookingDate = new Date(booking.date);

    const date = new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone,
    }).format(bookingDate);

    const time = booking.timeSlot;

    let subject = "";
    let text = "";

    if (booking.status === "confirmed") {
      notificationMessage = `Your booking for "${serviceName}" on ${date} at ${time} has been confirmed.`;
      subject = "Your Booking is Confirmed!";
      text = `Hi ${name || "User"},\n\nYour booking for "${serviceName}" has been confirmed.\n\n📅 Date: ${date}\n⏰ Time: ${time}\n📍 Location: ${STATIC_LOCATION}\n\n✅ Check your status in your profile.\n\nThank you for booking with us!\nSalonBlis App Team`;
    } else if (booking.status === "cancelled") {
      notificationMessage = `Your booking for "${serviceName}" on ${date} at ${time} has been cancelled.`;
      subject = "Your Booking Has Been Cancelled";
      text = `Hi ${name || "User"},\n\nYour booking for "${serviceName}" on ${date} at ${time} has been cancelled.\n\nIf this was unexpected, please reach out to our support team.\n\nSalonBlis App Team`;
    }

    // Save Notification
    if (notificationMessage) {
      await Notification.create({
        user: booking.user._id,
        message: notificationMessage,
      });
    }

    // Send email 
    if (subject && text) {
      const msg = {
        to: email,
        from: "aryan.dev1066@gmail.com", // VERIFIED IN SENDGRID
        subject,
        text,
        html: `<p>${text.replace(/\n/g, "<br/>")}</p>`,
      };

      sgMail.send(msg)
        .then(() => console.log("Email sent successfully"))
        .catch(err => console.error("SendGrid email error:", err.response?.body || err));
    }

    res.status(200).json({ message: "Booking status updated", booking });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ message: "Error updating booking status", error });
  }
};

// Delete a booking (User can delete only PENDING bookings)
exports.deleteBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // ✅ Only allow deleting if status is "pending"
    if (booking.status !== "pending" && req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only pending bookings can be deleted"
      });
    }

    // ✅ User can delete only their own booking (Admin can delete any)
    if (booking.user.toString() !== userId.toString() && req.user.role !== "admin") {
      return res.status(403).json({
        message: "You can only delete your own bookings"
      });
    }

    await booking.deleteOne();

    console.log("✅ Booking deleted successfully");
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting booking:", error);
    res.status(500).json({
      message: "Error deleting booking",
      error: error.message
    });
  }
};

//disable allredy book and locking sloat
exports.getBookedSlots = async (req, res) => {
  const { date } = req.query;
  const userId = req.user?.id;

  // ✅ Only count non-cancelled bookings as "booked"
  const bookings = await Booking.find({ 
    date, 
    status: { $ne: "cancelled" }  // 👈 ADD THIS LINE
  }).select("timeSlot");

  const locks = await SlotLock.find({ 
    date, 
    user: { $ne: userId } 
  }).select("timeSlot");

  const bookedSlots = bookings.map(b => b.timeSlot);
  const lockedSlots = locks.map(l => l.timeSlot);

  res.json({ bookedSlots, lockedSlots });
};
// Get booking analytics for admin dashboard
exports.getBookingAnalytics = async (req, res) => {
  try {
    const { period } = req.query; // daily, weekly, monthly, yearly

    const now = new Date();
    let startDate;
    let groupBy;

    // Determine date range and grouping
    switch (period) {
      case 'daily':
        startDate = new Date(now.setDate(now.getDate() - 7)); // Last 7 days
        groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$date" } };
        break;
      case 'weekly':
        startDate = new Date(now.setDate(now.getDate() - 28)); // Last 4 weeks
        groupBy = { $week: "$date" };
        break;
      case 'monthly':
        startDate = new Date(now.setMonth(now.getMonth() - 6)); // Last 6 months
        groupBy = { $dateToString: { format: "%Y-%m", date: "$date" } };
        break;
      case 'yearly':
        startDate = new Date(now.setFullYear(now.getFullYear() - 5)); // Last 5 years
        groupBy = { $year: "$date" };
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 6));
        groupBy = { $dateToString: { format: "%Y-%m", date: "$date" } };
    }

    const bookings = await Booking.aggregate([
      {
        $match: {
          date: { $gte: startDate }
        }
      },
      {
        $lookup: {
          from: 'services',
          localField: 'service',
          foreignField: '_id',
          as: 'serviceDetails'
        }
      },
      {
        $unwind: '$serviceDetails'
      },
      {
        $group: {
          _id: groupBy,
          bookings: { $sum: 1 },
          revenue: { $sum: '$serviceDetails.price' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching booking analytics:", error);
    res.status(500).json({ message: "Error fetching analytics", error: error.message });
  }
};

// Get popular services
exports.getPopularServices = async (req, res) => {
  try {
    const services = await Booking.aggregate([
      {
        $group: {
          _id: '$service',
          bookings: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'services',
          localField: '_id',
          foreignField: '_id',
          as: 'serviceDetails'
        }
      },
      {
        $unwind: '$serviceDetails'
      },
      {
        $project: {
          name: '$serviceDetails.name',
          bookings: 1,
          _id: 0
        }
      },
      {
        $sort: { bookings: -1 }
      },
      {
        $limit: 6
      }
    ]);

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Error fetching popular services", error: error.message });
  }
};

// Get booking status distribution
exports.getStatusDistribution = async (req, res) => {
  try {
    const distribution = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          value: { $sum: 1 }
        }
      },
      {
        $project: {
          name: {
            $switch: {
              branches: [
                { case: { $eq: ['$_id', 'pending'] }, then: 'Pending' },
                { case: { $eq: ['$_id', 'confirmed'] }, then: 'Confirmed' },
                { case: { $eq: ['$_id', 'cancelled'] }, then: 'Cancelled' }
              ],
              default: 'Unknown'
            }
          },
          value: 1,
          _id: 0
        }
      }
    ]);

    res.status(200).json(distribution);
  } catch (error) {
    res.status(500).json({ message: "Error fetching status distribution", error: error.message });
  }
};

// Get peak hours analysis
exports.getPeakHours = async (req, res) => {
  try {
    const peakHours = await Booking.aggregate([
      {
        $group: {
          _id: '$timeSlot',
          bookings: { $sum: 1 }
        }
      },
      {
        $project: {
          time: '$_id',
          bookings: 1,
          _id: 0
        }
      },
      {
        $sort: { time: 1 }
      }
    ]);

    res.status(200).json(peakHours);
  } catch (error) {
    res.status(500).json({ message: "Error fetching peak hours", error: error.message });
  }
};

// Get dashboard summary (all stats at once)
exports.getDashboardSummary = async (req, res) => {
  try {
    const totalUsers = await require('../models/User.model').countDocuments();
    const totalServices = await require('../models/Service.model').countDocuments();
    const totalBookings = await Booking.countDocuments();
    // Calculate total revenue
    const revenueData = await Booking.aggregate([
      {
        $lookup: {
          from: 'services',
          localField: 'service',
          foreignField: '_id',
          as: 'serviceDetails'
        }
      },
      {
        $unwind: '$serviceDetails'
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$serviceDetails.price' }
        }
      }
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    res.status(200).json({
      totalUsers,
      totalServices,
      totalBookings,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard summary", error: error.message });
  }
};