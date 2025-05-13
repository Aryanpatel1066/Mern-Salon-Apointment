const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const initAdmin = require('./utils/initAdmin') 
dotenv.config();  
connectDB(); // Connect to MongoDB
const app = express();
app.use(express.json());  
const corsOptions = {
    origin: "https://mern-salon-apointment.vercel.app/" ,  
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],   
    allowedHeaders: ["Content-Type", "Authorization"],  
    credentials: true, // Required for cookies/auth headers
  //origin :http://localhost:5173
  };
  
  // Apply CORS middleware globally
  app.use(cors(corsOptions));
  

 
initAdmin()
// Test Route
app.get("/", (req, res) => {
    res.send("🚀 Salon Booking API is Running...");
});
app.use("/api/users", require("./routes/auth.route"));
app.use("/api/services", require("./routes/service.route")); // ✅ Added services route
app.use("/api/booking",require('./routes/booking.route'))
app.use("/api/email",require("./routes/email.route"))

app.use("/api/notifications", require("./routes/notification.route"));

// Start Server on Port from .env
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
