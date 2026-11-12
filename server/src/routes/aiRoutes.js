const express = require("express");
const router = express.Router();

const {
  chatWithAI,
  analyzeCarbonFootprint,
  getPersonalizedRecommendations,
  generateEcoChallenge
} = require("../controllers/aiController");

const protect = require("../middleware/authMiddleware");

// AI Green Assistant
router.post("/chat", protect, chatWithAI);

// AI Carbon Analyzer
router.get("/analyze", protect, analyzeCarbonFootprint);

// Personalized Recommendations
router.get("/recommendations", protect, getPersonalizedRecommendations);

// AI Eco Challenge Generator
router.get("/challenge", protect, generateEcoChallenge);

module.exports = router;
