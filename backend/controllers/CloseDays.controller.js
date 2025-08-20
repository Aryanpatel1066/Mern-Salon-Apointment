const ClosedDay = require("../models/CloseDay.model");

// Add a closed day (Admin)
const addClosedDay = async (req, res) => {
  try {
    const { date } = req.body;
    if (!date) return res.status(400).json({ message: "Date is required" });

    const exists = await ClosedDay.findOne({ date });
    if (exists) return res.status(400).json({ message: "This day is already marked closed" });

    const closedDay = new ClosedDay({ date });
    await closedDay.save();

    res.status(201).json({ message: "Salon closed day added", closedDay });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all closed days
const getClosedDays = async (req, res) => {
  try {
    const closedDays = await ClosedDay.find();
    res.json({ closedDays });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete a closed day
const deleteClosedDay = async (req, res) => {
  try {
    await ClosedDay.findByIdAndDelete(req.params.id);
    res.json({ message: "Closed day removed" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { addClosedDay, getClosedDays, deleteClosedDay };
