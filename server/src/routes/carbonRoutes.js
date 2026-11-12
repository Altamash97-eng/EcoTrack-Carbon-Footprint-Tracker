
const express = require("express");
const router = express.Router();

const {
  addCarbonEntry,
  getCarbonEntries,
  getCarbonStats
} = require("../controllers/carbonController");

const protect = require("../middleware/authMiddleware");

// Add carbon entry
router.post("/", protect, addCarbonEntry);

// Get user's carbon entries
router.get("/", protect, getCarbonEntries);
router.get("/stats", protect, getCarbonStats);

module.exports = router;
