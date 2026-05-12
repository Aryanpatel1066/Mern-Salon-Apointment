const mongoose = require("mongoose");
const Notification = require("../models/Notification.model");

// GET /api/notifications
exports.getNotificationsForUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const cursor = req.query.cursor;

    const query = { user: userId };

    if (cursor) {
      if (!mongoose.Types.ObjectId.isValid(cursor)) {
        return res.status(400).json({ message: "Invalid cursor" });
      }
      query._id = { $lt: cursor };
    }

    const notifications = await Notification.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .lean();

    let hasMore = false;
    let nextCursor = null;

    if (notifications.length > limit) {
      hasMore = true;
      notifications.pop();
      nextCursor = notifications[notifications.length - 1]._id;
    }

    res.status(200).json({
      data: notifications,
      nextCursor,
      hasMore,
    });
  } catch (err) {
    console.error("Fetch notifications error:", err);
    res.status(500).json({
      message: "Failed to fetch notifications",
      error: err.message,
    });
  }
};

// PATCH /api/notifications/mark-read
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, read: false },
      { $set: { read: true } }
    );

    const io = req.app.get("io");
    io.to(`user_${req.user.id}`).emit("notifications_read_all");
    io.to(`user_${req.user.id}`).emit("unread_count_updated", { count: 0 });

    res.status(200).json({
      message: "All notifications marked as read",
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to mark as read",
      error: err.message,
    });
  }
};

// GET /api/notifications/unread-count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user.id,
      read: false,
    });

    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch notification count",
      error: err.message,
    });
  }
};