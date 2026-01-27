const Service = require("../models/Service.model");

// ✅ Create a new service by admin
const createService = async (req, res) => {
    try {

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
        res.status(201).json({ message: "Service added successfully", service: newService });
    } catch (error) {
        console.error("❌ Error creating service:", error);
        res.status(500).json({ message: "Error creating service", error: error.message });
    }
};

// ✅ Get all services with filter 
const getAllServices = async (req, res) => {
  try {
    const { search, price, duration, sort, availableOnly } = req.query;

    // Build filter object
    let filter = {};

    // Search filter (name or description)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Price range filter
    if (price) {
      if (price === "low") {
        filter.price = { $lt: 500 };
      } else if (price === "mid") {
        filter.price = { $gte: 500, $lte: 1000 };
      } else if (price === "high") {
        filter.price = { $gt: 1000 };
      }
    }

    // Duration filter (in minutes)
    if (duration) {
      if (duration === "30") {
        filter.duration = { $lte: 30 };
      } else if (duration === "60") {
        filter.duration = { $lte: 60 };
      } else if (duration === "90") {
        filter.duration = { $gte: 90 };
      }
    }

    // Available only filter
    if (availableOnly === "true") {
      filter.available = true;
    }

    // Build sort object
    let sortObj = {};
    if (sort) {
      if (sort === "name") {
        sortObj = { name: 1 }; // A-Z
      } else if (sort === "price-low") {
        sortObj = { price: 1 }; // Low to High
      } else if (sort === "price-high") {
        sortObj = { price: -1 }; // High to Low
      } else if (sort === "duration") {
        sortObj = { duration: 1 }; // Short to Long
      }
    } else {
      sortObj = { name: 1 }; // Default sort by name
    }

    // Execute query
    const services = await Service.find(filter).sort(sortObj);

    res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    console.error("❌ Error fetching services:", error);
    res.status(500).json({ message: "Error fetching services", error: error.message });
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
    updateService,
    deleteService,
};