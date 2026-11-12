
require("dotenv").config();

const dns = require("dns");

// Google DNS resolvers
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// Database connection
const connectDB = require("./src/config/db");

// Routes
const authRoutes = require("./src/routes/authRoutes");
const carbonRoutes = require("./src/routes/carbonRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const aiRoutes = require("./src/routes/aiRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/carbon", carbonRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);

// Home route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Carbon Tracker API is running!"
  });
});

// Server port
const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log("MongoDB Connected Successfully");
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

startServer();
