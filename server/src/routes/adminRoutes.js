
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
  getAdminStats,
  getAllUsers,
  getAllActivities
} = require("../controllers/adminController");

// All routes require login and admin privileges
router.use(protect, admin);

// Admin dashboard statistics
router.get("/stats", getAdminStats);

// Get all registered users
router.get("/users", getAllUsers);

// Get all carbon activities
router.get("/activities", getAllActivities);

module.exports = router;
