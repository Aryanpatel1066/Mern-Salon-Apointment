const bcrypt = require("bcryptjs");
const User = require("../models/User.model");

const initAdmin = async () => {
    try {
        // Check if admin user exists
        const adminUser = await User.findOne({ email: "aryanpatel1248@gmail.com" });

        if (adminUser) {
            console.log("✅ Admin user already exists");
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash("welcome1", 10); // Use async bcrypt.hash

        // Create admin user
        const newUser = await User.create({
            name: "Aryan Patel",
            email: "aryanpatel1248@gmail.com",
            role: "admin",
            password: hashedPassword, // Store hashed password
        });

        console.log("🎉 Admin user created successfully:", newUser.email);
    } catch (err) {
        console.error("❌ Error during admin initialization:", err);
    }
};

module.exports = initAdmin;
