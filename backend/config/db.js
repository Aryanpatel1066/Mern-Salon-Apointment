const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;