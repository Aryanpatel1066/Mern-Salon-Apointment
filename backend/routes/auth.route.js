const express = require("express");
const { registerUser, loginUser, getUserProfile } = require("../controllers/auth.controller");
const { authMiddleware, verifySignupBody,verifySignInBody } = require("../middleware/authMiddleware"); // ✅ Fixed Import


const router = express.Router();

// Public Routes
router.post("/register", verifySignupBody, registerUser); // ✅ Fixed Middleware Usage

router.post("/login", verifySignInBody,loginUser);

// Protected Routes (Require Token)
router.get("/profile", authMiddleware, getUserProfile);

module.exports = router;
