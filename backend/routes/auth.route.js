const express = require("express");
const { registerUser, loginUser, getUserProfile, getAllUser,deleteUser,updateUser } = require("../controllers/auth.controller");
const { authMiddleware, verifySignupBody,verifySignInBody, isAdmin } = require("../middleware/authMiddleware"); // ✅ Fixed Import


const router = express.Router();

// Public Routes
router.post("/register", verifySignupBody, registerUser);  
router.post("/login", verifySignInBody,loginUser);

 router.get("/profile/:id", authMiddleware, getUserProfile);
//admin side route
router.get("/admin/userList",authMiddleware,isAdmin,getAllUser)
router.delete('/admin/userDelete/:id',authMiddleware, isAdmin, deleteUser);
router.put('/admin/userupdate/:id', authMiddleware,isAdmin, updateUser);
module.exports = router;
