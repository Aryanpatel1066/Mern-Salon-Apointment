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
    // origin: "http://localhost:5173",
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
// Routes
app.use("/api", require("./routes"));


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
