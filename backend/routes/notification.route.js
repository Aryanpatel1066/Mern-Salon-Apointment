const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/", authMiddleware, notificationController.getNotificationsForUser);
router.patch("/mark-read", authMiddleware, notificationController.markAllAsRead);
router.get("/unread-count", authMiddleware, notificationController.getUnreadCount);

module.exports = router;
