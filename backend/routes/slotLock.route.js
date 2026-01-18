const express = require("express");
const router = express.Router();
const { lockSlot } = require("../controllers/lockSlot.controller");
const { authMiddleware } = require("../middleware/authMiddleware");

// 🔒 Lock a slot (10 minutes)
router.post("/lock-slot", authMiddleware,lockSlot);

module.exports = router;
