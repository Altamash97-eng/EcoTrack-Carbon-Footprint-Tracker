
const User = require("../models/User");
const CarbonEntry = require("../models/CarbonEntry");

// Get admin dashboard statistics
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalActivities = await CarbonEntry.countDocuments();

    const emissions = await CarbonEntry.aggregate([
      {
        $group: {
          _id: null,
          totalCO2: { $sum: "$co2e" }
        }
      }
    ]);

    res.status(200).json({
      totalUsers,
      totalActivities,
      totalCO2: emissions[0]?.totalCO2 || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all registered users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all carbon activities
const getAllActivities = async (req, res) => {
  try {
    const activities = await CarbonEntry.find()
      .populate("user", "name email")
      .sort({ date: -1 });

    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  getAllActivities
};
