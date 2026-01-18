const mongoose = require("mongoose");

const slotLockSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    date: { type: String, required: true }, // "YYYY-MM-DD"
    timeSlot: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

/**
 * 🔥 IMPORTANT
 * MongoDB will auto-delete this document when expiresAt < now
 */
slotLockSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
// 🔥 Prevent race condition (ONLY ONE lock per slot)
slotLockSchema.index(
  { date: 1, timeSlot: 1 },
  { unique: true }
);
module.exports = mongoose.model("SlotLock", slotLockSchema);
