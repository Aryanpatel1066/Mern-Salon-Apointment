// routes/timeSlot.routes.js
const express = require("express");
const router = express.Router();
const {
  getTimeSlots,
  getAllDateSpecificSlots,
  updateDefaultSlots,
  setDateSpecificSlots,
  deleteDateSpecificSlots,
  resetDefaultSlots,
} = require("../controllers/timeSloat.controller"); // Your actual file name
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");

// ========== PUBLIC ROUTES ==========
router.get("/time-slots", getTimeSlots);

// ========== ADMIN ROUTES (PROTECTED) ==========
router.get("/time-slots/date-specific", authMiddleware, isAdmin, getAllDateSpecificSlots);
router.put("/time-slots/default", authMiddleware, isAdmin, updateDefaultSlots);
router.post("/time-slots/default/reset", authMiddleware, isAdmin, resetDefaultSlots);
router.post("/time-slots/date-specific", authMiddleware, isAdmin, setDateSpecificSlots);
router.delete("/time-slots/date-specific/:date", authMiddleware, isAdmin, deleteDateSpecificSlots);

module.exports = router;