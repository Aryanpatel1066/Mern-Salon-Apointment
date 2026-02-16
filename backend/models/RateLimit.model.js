const mongoose = require("mongoose");

const rateLimitSchema = new mongoose.Schema({
  key: { type: String, required: true }, 
  count: { type: Number, default: 1 },
  expiresAt: { type: Date, required: true }
});

// TTL index → auto delete after expiresAt
rateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("RateLimit", rateLimitSchema);
