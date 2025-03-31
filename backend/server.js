const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const initAdmin = require('./utils/initAdmin') 
dotenv.config();  
connectDB(); // Connect to MongoDB

const app = express();
app.use(express.json()); // Middleware to parse JSON requests
app.use(cors()); // Enable CORS
 initAdmin()
// Test Route
app.get("/", (req, res) => {
    res.send("🚀 Salon Booking API is Running...");
});
app.use("/api/users", require("./routes/auth.route"));
app.use("/api/services", require("./routes/service.route")); // ✅ Added services route

// Start Server on Port from .env
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
