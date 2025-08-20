const express = require("express");
const { addClosedDay, getClosedDays, deleteClosedDay } = require("../controllers/CloseDays.controller");
const router = express.Router();

// Admin adds closed day
router.post("/", addClosedDay);

// Fetch closed days
router.get("/", getClosedDays);

// Remove closed day/
router.delete("/:id", deleteClosedDay);

module.exports = router;
