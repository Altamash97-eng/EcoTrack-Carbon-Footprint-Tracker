
const CarbonEntry = require("../models/CarbonEntry");

// ==========================================
// 1. AI GREEN ASSISTANT
// ==========================================

const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid message."
      });
    }

    if (message.length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Message must be under 2000 characters."
      });
    }

    const { GoogleGenAI } = await import("@google/genai");

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: `
        You are an AI Green Assistant in a Carbon Footprint Tracker.
        Give clear, practical and environmentally responsible advice.
        Keep answers concise and easy to understand.

        User question: ${message}
      `
    });

    res.status(200).json({
      success: true,
      reply: response.text
    });

  } catch (error) {
    console.error("AI Error:", error.message);

    res.status(500).json({
      success: false,
      message: "AI assistant is temporarily unavailable."
    });
  }
};


// ==========================================
// 2. AI CARBON FOOTPRINT ANALYZER
// ==========================================

const analyzeCarbonFootprint = async (req, res) => {
  try {
    const entries = await CarbonEntry.find({
      user: req.user._id
    });

    if (entries.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No carbon entries found. Add activities first."
      });
    }

    const totalCO2e = entries.reduce(
      (total, entry) => total + entry.co2e,
      0
    );

    const categoryTotals = {};

    entries.forEach((entry) => {
      categoryTotals[entry.category] =
        (categoryTotals[entry.category] || 0) + entry.co2e;
    });

    const highestCategory = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])[0];

    const { GoogleGenAI } = await import("@google/genai");

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: `
        Analyze this user's carbon footprint data.

        Total recorded CO2e: ${totalCO2e}
        Category breakdown: ${JSON.stringify(categoryTotals)}
        Number of activities: ${entries.length}
        Highest emission category: ${highestCategory[0]}

        Provide:
        1. A simple explanation of the footprint.
        2. The biggest source of emissions.
        3. Five practical ways to reduce emissions.
        4. One weekly eco-friendly challenge.

        Do not invent missing data or unsupported averages.
        Keep the response clear and student-friendly.
      `
    });

    res.status(200).json({
      success: true,
      statistics: {
        totalCO2e: Number(totalCO2e.toFixed(2)),
        categoryTotals,
        highestCategory: highestCategory[0],
        totalActivities: entries.length
      },
      analysis: response.text
    });

  } catch (error) {
    console.error("Carbon Analysis Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to analyze carbon footprint right now."
    });
  }
};


// ==========================================
// 3. PERSONALIZED AI RECOMMENDATIONS
// ==========================================

const getPersonalizedRecommendations = async (req, res) => {
  try {
    const entries = await CarbonEntry.find({
      user: req.user._id
    });

    if (entries.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Please add carbon activities first."
      });
    }

    const categoryTotals = {};

    entries.forEach((entry) => {
      categoryTotals[entry.category] =
        (categoryTotals[entry.category] || 0) + entry.co2e;
    });

    const totalCO2e = entries.reduce(
      (sum, entry) => sum + entry.co2e,
      0
    );

    const { GoogleGenAI } = await import("@google/genai");

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: `
        You are a personal carbon reduction advisor.

        Analyze this user's recorded data:

        Total CO2e: ${totalCO2e}
        Category breakdown: ${JSON.stringify(categoryTotals)}

        Generate:
        1. Three personalized recommendations.
        2. Rank them from highest potential impact to lowest.
        3. Explain why each recommendation matters.
        4. Give one simple action the user can start today.

        Base recommendations on the largest recorded emission categories.
        Do not invent emission savings or unsupported statistics.
        Keep the language simple and practical.
      `
    });

    res.status(200).json({
      success: true,
      totalCO2e: Number(totalCO2e.toFixed(2)),
      categoryTotals,
      recommendations: response.text
    });

  } catch (error) {
    console.error("Recommendation Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to generate recommendations right now."
    });
  }
};

const generateEcoChallenge = async (req, res) => {
  try {
    const entries = await CarbonEntry.find({
      user: req.user._id
    });

    if (entries.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Please add carbon activities first to generate a challenge."
      });
    }

    // Calculate category-wise emissions
    const categoryTotals = {};

    entries.forEach((entry) => {
      categoryTotals[entry.category] =
        (categoryTotals[entry.category] || 0) + entry.co2e;
    });

    // Find the highest emission category
    const highestCategory = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])[0][0];

    const { GoogleGenAI } = await import("@google/genai");

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: `
        You are an eco-friendly challenge generator.

        User's highest emission category: ${highestCategory}
        Category emissions: ${JSON.stringify(categoryTotals)}

        Create a personalized 7-day eco challenge.

        Include:
        1. A creative challenge title.
        2. A short description.
        3. Seven daily tasks, one for each day.
        4. A motivational completion message.

        Focus mainly on reducing ${highestCategory} emissions.
        Make tasks practical, affordable and achievable.
        Do not invent carbon savings or guaranteed emission reductions.
        Format the response clearly using headings and numbered lists.
      `
    });

    res.status(200).json({
      success: true,
      focusCategory: highestCategory,
      challengeDuration: "7 days",
      challenge: response.text
    });

  } catch (error) {
    console.error("Eco Challenge Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to generate an eco challenge right now."
    });
  }
};


// ==========================================
// EXPORT ALL FUNCTIONS
// ==========================================

module.exports = {
  chatWithAI,
  analyzeCarbonFootprint,
  getPersonalizedRecommendations,
  generateEcoChallenge
};