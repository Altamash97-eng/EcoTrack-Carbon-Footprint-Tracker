const mongoose = require("mongoose");
const CarbonEntry = require("../models/CarbonEntry");

// Add Carbon Entry
const addCarbonEntry = async (req, res) => {
  try {
    const { category, activity, quantity, co2e } = req.body;

    if (!category || !activity || quantity == null || co2e == null) {
      return res.status(400).json({
        message: "Please provide all required fields"
      });
    }

    const entry = await CarbonEntry.create({
      user: req.user.id || req.user._id,
      category,
      activity,
      quantity,
      co2e
    });

    res.status(201).json({
      message: "Carbon entry added successfully",
      entry
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Get User Carbon Entries
const getCarbonEntries = async (req, res) => {
  try {
    const entries = await CarbonEntry.find({
      user: req.user.id || req.user._id
    }).sort({ date: -1 });

    res.status(200).json(entries);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
const getCarbonStats = async (req, res) => {
  try {
 const userId = new mongoose.Types.ObjectId(
  req.user.id || req.user._id
);

    // Calculate total emissions
    const total = await CarbonEntry.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalCO2: { $sum: "$co2e" },
          totalActivities: { $sum: 1 }
        }
      }
    ]);

    // Calculate category-wise emissions
    const categoryStats = await CarbonEntry.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$category",
          totalCO2: { $sum: "$co2e" }
        }
      }
    ]);

    res.status(200).json({
      totalCO2: total[0]?.totalCO2 || 0,
      totalActivities: total[0]?.totalActivities || 0,
      categoryStats
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addCarbonEntry,
  getCarbonEntries,
  getCarbonStats
};
