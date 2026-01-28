const jwt = require("jsonwebtoken");
const User = require("../models/User.model"); // Corrected model import

// Middleware to verify JWT token (Protect Routes)
const authMiddleware = async (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Access Denied. No Token Provided." });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId);

        if (!user) return res.status(401).json({ message: "User not found" });

        req.user = { id: user._id, role: user.role };
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        res.status(401).json({ message: "Invalid Token" });
    }
};

// Middleware to Validate Signup Request
const verifySignupBody = async (req, res, next) => {
    try {
        const { name, email, password, confirmPassword, phone } = req.body;

        if (!name) return res.status(400).json({ message: "Name is required" });
        if (!email) return res.status(400).json({ message: "Email is required" });
        if (!phone) return res.status(400).json({ message: "Phone number is required" });
        if (!password) return res.status(400).json({ message: "Password is required" });
        if (!confirmPassword)
            return res.status(400).json({ message: "Confirm password is required" });
        if (req.body.password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long"
            });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        if (!/^[0-9]{10}$/.test(phone)) {
            return res.status(400).json({ message: "Invalid phone number" });
        }

        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const phoneExists = await User.findOne({ phone });
        if (phoneExists) {
            return res.status(400).json({ message: "Phone number already registered" });
        }

        next();
    } catch (err) {
        res.status(500).json({ message: "Signup validation failed" });
    }
};

module.exports = verifySignupBody;


const verifySignInBody = async (req, res, next) => {
    try {
        if (!req.body.email) {
            return res.status(400).send({ message: "User email is required" });
        }
        if (!req.body.password) {
            return res.status(400).send({ message: "User password is required" });
        }
        next()
    }
    catch (err) {
        res.status(500).send({
            message: "internal error while checking signin body"
        })
    }
};

// Middleware to check if user is an admin
const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Access Denied. Admins only." });
    }
    next();
};
// Export both middlewares correctly
module.exports = {
    authMiddleware,
    verifySignupBody,
    verifySignInBody,
    isAdmin
};