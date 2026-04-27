const express = require("express");
const router = express.Router();

const analyticsController = require("../controllers/analytics.controller");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");

// SAME PATHS (important)
router.get("/analytics/trends", authMiddleware, isAdmin, analyticsController.getBookingAnalytics);
router.get("/analytics/popular-services", authMiddleware, isAdmin, analyticsController.getPopularServices);
router.get("/analytics/status-distribution", authMiddleware, isAdmin, analyticsController.getStatusDistribution);
router.get("/analytics/peak-hours", authMiddleware, isAdmin, analyticsController.getPeakHours);
router.get("/analytics/dashboard-summary", authMiddleware, isAdmin, analyticsController.getDashboardSummary);

module.exports = router;