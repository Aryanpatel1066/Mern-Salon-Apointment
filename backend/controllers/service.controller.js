const Service = require("../models/Service.model");

// ✅ Create a new service
const createService = async (req, res) => {
    try {
        console.log("🟡 Received Body:", req.body); // ✅ Debugging line

        const { name, description, price, duration, available } = req.body;

        if (!name || !price || !duration) {
            return res.status(400).json({ message: "Name, Price, and Duration are required" });
        }

        const newService = new Service({
            name,
            description,
            price,
            duration,
            available: available !== undefined ? available : true
        });

        await newService.save();
        console.log("✅ Service Created:", newService); // ✅ Debugging line
        res.status(201).json({ message: "Service added successfully", service: newService });
    } catch (error) {
        console.error("❌ Error creating service:", error);
        res.status(500).json({ message: "Error creating service", error: error.message });
    }
};



// ✅ Get all services
const getAllServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: "Error fetching services", error: error.message });
    }
};

// ✅ Get a single service by ID
const getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ message: "Error fetching service", error: error.message });
    }
};

// ✅ Update a service
const updateService = async (req, res) => {
    try {
        const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedService) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.status(200).json({ message: "Service updated successfully", service: updatedService });
    } catch (error) {
        res.status(500).json({ message: "Error updating service", error: error.message });
    }
};

// ✅ Delete a service
const deleteService = async (req, res) => {
    try {
        const deletedService = await Service.findByIdAndDelete(req.params.id);
        if (!deletedService) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.status(200).json({ message: "Service deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting service", error: error.message });
    }
};

module.exports = {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService
};
