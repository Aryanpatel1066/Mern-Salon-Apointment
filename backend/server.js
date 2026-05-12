const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const cors = require("cors");
const initAdmin = require("./utils/initAdmin");

dotenv.config();

const app = express();
const server = http.createServer(app);

const CLIENT_URL =
  process.env.CLIENT_URL || "https://mern-salon-apointment.vercel.app";

app.use(express.json());

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

const io = new Server(server, {
  cors: {
    origin: "https://mern-salon-apointment.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User joined room: user_${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("🚀 Salon Booking API is Running...");
});

app.use("/api", require("./routes"));

const PORT = process.env.PORT || 1066;

server.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  try {
    await connectDB();
    console.log("✅ MongoDB connected");
    await initAdmin();
  } catch (err) {
    console.error("❌ MongoDB connection failed", err);
  }
});