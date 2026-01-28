const express = require("express");
const {
    createService,
    getAllServices,
     updateService,
    deleteService,
    getAvailableServices
} = require("../controllers/service.controller");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware"); // ✅ Added isAdmin

const router = express.Router();

// ✅ Public Routes (Both Admin & Customers can access)
router.get("/", getAllServices); // Get all services
router.get("/available",getAvailableServices)
// ✅ Admin Routes (Protected)
router.post("/", authMiddleware, isAdmin, createService); // Create new service
router.put("/:id", authMiddleware, isAdmin, updateService); // Update service
router.delete("/:id", authMiddleware, isAdmin, deleteService); // Delete service
 module.exports = router;