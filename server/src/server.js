/**
 * Main Express Server Application
 * Initializes the MERN backend with routes, middleware, and MongoDB connection
 * Serves as the API gateway for the Agent List Distributor application
 */

import "dotenv/config";
import cors from "cors";
import express from "express";
import { connectDB } from "./config/db.js";
import { requireAuth } from "./middleware/auth.js";
import authRoutes from "./routes/authRoutes.js";
import agentRoutes from "./routes/agentRoutes.js";
import distributionRoutes from "./routes/distributionRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

// Initialize Express application
const app = express();
const port = process.env.PORT || 5000;

// Middleware: Enable CORS for all origins with credentials support
app.use(cors({ origin: "*", credentials: true }));

// Middleware: Parse incoming JSON request bodies
app.use(express.json());

/**
 * Health Check Endpoint
 * Simple endpoint to verify server is running
 * Used by frontend to detect backend availability
 */
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Routes: Public endpoints (no authentication required)
app.use("/api/auth", authRoutes);

// Routes: Protected endpoints (require JWT authentication)
app.use("/api/agents", requireAuth, agentRoutes);
app.use("/api/distributions", requireAuth, distributionRoutes);
app.use("/api/dashboard", requireAuth, dashboardRoutes);

/**
 * Global Error Handler Middleware
 * Handles errors from multer file upload and other sources
 * Provides appropriate HTTP status codes and error messages
 */
app.use((error, _req, res, _next) => {
  // Handle multer file validation errors
  if (error.message?.includes("Only csv")) {
    return res.status(400).json({ message: error.message });
  }

  // Handle file size limit errors from multer
  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "File size must be 5MB or less" });
  }

  // Handle unexpected server errors
  res.status(500).json({ message: "Server error", error: error.message });
});

/**
 * Server Startup
 * Connects to MongoDB first, then starts listening for requests
 * Fails gracefully if database connection is unavailable
 */
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Unable to start server:", error.message);
    process.exit(1);
  });

