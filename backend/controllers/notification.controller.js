const Notification = require("../models/Notification.model");

// GET /api/notifications (User-specific)
exports.getNotificationsForUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;
    const cursor = req.query.cursor;

    let query = { user: userId };

    // 🧠 Cursor condition
    if (cursor) {
      query._id = { $lt: cursor };
    }

    // 🔥 Fetch one extra to detect hasMore
    const notifications = await Notification.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1);

    let hasMore = false;
    let nextCursor = null;

    if (notifications.length > limit) {
      hasMore = true;
      notifications.pop(); // remove extra
      nextCursor = notifications[notifications.length - 1]._id;
    }

    res.status(200).json({
      data: notifications,
      nextCursor,
      hasMore,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch notifications",
    });
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
