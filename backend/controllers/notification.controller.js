const Notification = require("../models/Notification.model");

// GET /api/notifications (User-specific)
exports.getNotificationsForUser = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notifications", error: err.message });
  }
};

// PATCH /api/notifications/mark-read
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user.id }, { $set: { read: true } });
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark as read", error: err.message });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ user: req.user.id, read: false });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notification count" });
  }
};
