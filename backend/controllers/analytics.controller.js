const Booking = require("../models/Booking.model");

exports.getBookingAnalytics = async (req, res) => {
  try {
    const { period } = req.query; // daily, weekly, monthly, yearly

    const now = new Date();
    let startDate;
    let groupBy;

    // Determine date range and grouping
    switch (period) {
      case 'daily':
        startDate = new Date(now.setDate(now.getDate() - 7)); // Last 7 days
        groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$date" } };
        break;
      case 'weekly':
        startDate = new Date(now.setDate(now.getDate() - 28)); // Last 4 weeks
        groupBy = { $week: "$date" };
        break;
      case 'monthly':
        startDate = new Date(now.setMonth(now.getMonth() - 6)); // Last 6 months
        groupBy = { $dateToString: { format: "%Y-%m", date: "$date" } };
        break;
      case 'yearly':
        startDate = new Date(now.setFullYear(now.getFullYear() - 5)); // Last 5 years
        groupBy = { $year: "$date" };
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 6));
        groupBy = { $dateToString: { format: "%Y-%m", date: "$date" } };
    }

    const bookings = await Booking.aggregate([
      {
        $match: {
          date: { $gte: startDate }
        }
      },
      {
        $lookup: {
          from: 'services',
          localField: 'service',
          foreignField: '_id',
          as: 'serviceDetails'
        }
      },
      {
        $unwind: '$serviceDetails'
      },
      {
        $group: {
          _id: groupBy,
          bookings: { $sum: 1 },
          revenue: { $sum: '$serviceDetails.price' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching booking analytics:", error);
    res.status(500).json({ message: "Error fetching analytics", error: error.message });
  }
};

// Get popular services
exports.getPopularServices = async (req, res) => {
  try {
    const services = await Booking.aggregate([
      {
        $group: {
          _id: '$service',
          bookings: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'services',
          localField: '_id',
          foreignField: '_id',
          as: 'serviceDetails'
        }
      },
      {
        $unwind: '$serviceDetails'
      },
      {
        $project: {
          name: '$serviceDetails.name',
          bookings: 1,
          _id: 0
        }
      },
      {
        $sort: { bookings: -1 }
      },
      {
        $limit: 6
      }
    ]);

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Error fetching popular services", error: error.message });
  }
};

// Get booking status distribution
exports.getStatusDistribution = async (req, res) => {
  try {
    const distribution = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          value: { $sum: 1 }
        }
      },
      {
        $project: {
          name: {
            $switch: {
              branches: [
                { case: { $eq: ['$_id', 'pending'] }, then: 'Pending' },
                { case: { $eq: ['$_id', 'confirmed'] }, then: 'Confirmed' },
                { case: { $eq: ['$_id', 'cancelled'] }, then: 'Cancelled' }
              ],
              default: 'Unknown'
            }
          },
          value: 1,
          _id: 0
        }
      }
    ]);

    res.status(200).json(distribution);
  } catch (error) {
    res.status(500).json({ message: "Error fetching status distribution", error: error.message });
  }
};

// Get peak hours analysis
exports.getPeakHours = async (req, res) => {
  try {
    const peakHours = await Booking.aggregate([
      {
        $group: {
          _id: '$timeSlot',
          bookings: { $sum: 1 }
        }
      },
      {
        $project: {
          time: '$_id',
          bookings: 1,
          _id: 0
        }
      },
      {
        $sort: { time: 1 }
      }
    ]);

    res.status(200).json(peakHours);
  } catch (error) {
    res.status(500).json({ message: "Error fetching peak hours", error: error.message });
  }
};

// Get dashboard summary (all stats at once)
exports.getDashboardSummary = async (req, res) => {
  try {
    const totalUsers = await require('../models/User.model').countDocuments();
    const totalServices = await require('../models/Service.model').countDocuments();
    const totalBookings = await Booking.countDocuments();
    // Calculate total revenue
    const revenueData = await Booking.aggregate([
      {
        $lookup: {
          from: 'services',
          localField: 'service',
          foreignField: '_id',
          as: 'serviceDetails'
        }
      },
      {
        $unwind: '$serviceDetails'
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$serviceDetails.price' }
        }
      }
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    res.status(200).json({
      totalUsers,
      totalServices,
      totalBookings,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard summary", error: error.message });
  }
};