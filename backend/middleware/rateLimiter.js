const RateLimit = require("../models/RateLimit.model");

const rateLimiter = ({ keyPrefix, limit, windowMs }) => {
  return async (req, res, next) => {
    try {
      const identifier =
        req.user?.id || req.body.email || req.ip;

      const key = `${keyPrefix}:${identifier}`;
      const now = new Date();

      let record = await RateLimit.findOne({ key });

      // If no record OR expired → create fresh
      if (!record || record.expiresAt < now) {
        await RateLimit.findOneAndUpdate(
          { key },
          {
            key,
            count: 1,
            expiresAt: new Date(now.getTime() + windowMs)
          },
          { upsert: true }
        );
        return next();
      }

      // If limit exceeded
      if (record.count >= limit) {
        return res.status(429).json({
          message: "Too many attempts. Please try again later."
        });
      }

      // Increase count
      record.count += 1;
      await record.save();

      next();
    } catch (error) {
      console.error("Rate limiter error:", error);
      res.status(500).json({ message: "Rate limiter failed" });
    }
  };
};

module.exports = rateLimiter;
 