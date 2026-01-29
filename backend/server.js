const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const initAdmin = require("./utils/initAdmin");

dotenv.config();
const app = express();

 app.use(express.json());

app.use(
  cors({
  //  origin: "http://localhost:5173",
    origin: "https://mern-salon-apointment.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

 app.options("*", cors());

 app.get("/", (req, res) => {
  res.send("🚀 Salon Booking API is Running...");
});

/* ===== ROUTES ===== */
app.use("/api/users", require("./routes/auth.route"));
app.use("/api/services", require("./routes/service.route"));
app.use("/api/booking", require("./routes/booking.route"));
app.use("/api", require("./routes/slotLock.route")); 
app.use("/api/closed-days", require("./routes/closeDays.route"));
app.use("/api/email", require("./routes/email.route"));
app.use("/api/notifications", require("./routes/notification.route"));
app.use("/api", require("./routes/timeSloat.route"));

/* ===== SERVER ===== */
const PORT = process.env.PORT || 1066;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  try {
    await connectDB();
    console.log("✅ MongoDB connected");
    initAdmin();
  } catch (err) {
    console.error("❌ MongoDB connection failed", err);
  }
});
