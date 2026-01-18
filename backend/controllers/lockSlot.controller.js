const SlotLock = require("../models/SlotLock.model");
const Booking = require("../models/Booking.model");

exports.lockSlot = async (req, res) => {
  try {
    const { service, date, timeSlot } = req.body;
    const userId = req.user.id;

    // Already booked?
    const booked = await Booking.findOne({ date, timeSlot });
    if (booked) {
      return res.status(409).json({ message: "Slot already booked" });
    }

    // Optional: remove old locks of this user
    await SlotLock.deleteMany({ user: userId });

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await SlotLock.create({
      user: userId,
      service,
      date,
      timeSlot,
      expiresAt,
    });

    res.status(200).json({
      message: "Slot locked for 10 minutes",
      expiresAt,
    });
  } catch (err) {
    // 🔥 Handle duplicate key error
    if (err.code === 11000) {
      return res.status(409).json({ message: "Slot temporarily locked" });
    }

    res.status(500).json({ message: "Failed to lock slot" });
  }
};
