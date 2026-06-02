/**
 * Dashboard Routes
 * Provides analytics and summary statistics for the admin dashboard
 * Aggregates data from agents and distributions
 */

import express from "express";
import Agent from "../models/Agent.js";
import DistributionBatch from "../models/DistributionBatch.js";

const router = express.Router();

/**
 * GET /api/dashboard/summary
 * Returns overview statistics for the admin dashboard
 *
 * Response:
 *   - agentCount (number): Total number of active agents in the system
 *   - batchCount (number): Total number of CSV/Excel uploads processed
 *   - totalItems (number): Total leads distributed across all batches
 *
 * @example
 * Response:
 * {
 *   "agentCount": 5,
 *   "batchCount": 2,
 *   "totalItems": 50
 * }
 */
router.get("/summary", async (_req, res) => {
  // Count total number of agents in the database
  const agentCount = await Agent.countDocuments();
  
  // Retrieve all distribution batches with only totalItems and createdAt
  const batches = await DistributionBatch.find().select("totalItems createdAt");

  // Calculate total items by summing items across all batches
  const totalItems = batches.reduce((sum, batch) => sum + batch.totalItems, 0);

  // Return dashboard summary statistics
  res.json({
    agentCount,
    batchCount: batches.length,
    totalItems
  });
});

export default router;

