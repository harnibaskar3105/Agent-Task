/**
 * Distribution Routes
 * Handles CSV/Excel file uploads and lead distribution to agents
 * Manages the distribution batches stored in the database
 */

import express from "express";
import multer from "multer";
import Agent from "../models/Agent.js";
import DistributionBatch from "../models/DistributionBatch.js";
import { distributeSequentially } from "../utils/distribute.js";
import { parseUpload } from "../utils/fileParser.js";

const router = express.Router();

// Allowed file extensions for upload
const allowedExtensions = new Set(["csv", "xlsx", "xls", "axls"]);

/**
 * Multer configuration for file upload
 * - Stores files in memory (not on disk)
 * - Maximum file size: 5MB
 * - Validates file extension during upload
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    // Extract and validate file extension
    const extension = file.originalname.split(".").pop().toLowerCase();

    if (!allowedExtensions.has(extension)) {
      return cb(new Error("Only csv, xlsx, xls and axls files are allowed"));
    }

    cb(null, true);
  }
});

/**
 * GET /api/distributions
 * Retrieves all distribution batches with populated agent details
 * Batches are sorted by most recent first
 *
 * Response: Array of distribution batches with agent information
 * @example
 * [
 *   {
 *     "_id": "507f1f77bcf86cd799439011",
 *     "fileName": "leads.csv",
 *     "totalItems": 12,
 *     "allocations": [
 *       {
 *         "agent": { "_id": "...", "name": "John", "email": "...", "mobile": "..." },
 *         "items": [...]
 *       }
 *     ],
 *     "createdAt": "2026-06-02T..."
 *   }
 * ]
 */
router.get("/", async (_req, res) => {
  // Fetch all batches sorted chronologically (newest first)
  // Populate agent details within allocations for better readability
  const batches = await DistributionBatch.find()
    .sort({ createdAt: -1 })
    .populate("allocations.agent", "name email mobile");

  res.json(batches);
});

/**
 * POST /api/distributions/upload
 * Processes uploaded CSV/Excel file and distributes leads to agents
 * Validates file format, parses content, distributes sequentially
 *
 * Multipart form data:
 *   - file (required): CSV, XLSX, XLS, or AXLS file
 *
 * File requirements:
 *   - Must contain FirstName, Phone, and Notes columns
 *   - Maximum size: 5MB
 *   - Phone values must be numeric
 *
 * Response on success (201): Created batch with populated agent data
 * Response errors:
 *   - 400: File missing, invalid format, or validation failed
 *   - 500: Server error during processing
 *
 * Process:
 * 1. Validates file was uploaded
 * 2. Checks at least 5 agents exist
 * 3. Parses and validates file content
 * 4. Distributes items sequentially across 5 agents
 * 5. Stores batch in database
 * 6. Returns created batch with agent details
 */
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    // Verify file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a file" });
    }

    // Fetch all agents from database
    const agents = await Agent.find().sort({ createdAt: 1 });

    // Ensure minimum 5 agents exist for distribution
    if (agents.length < 5) {
      return res.status(400).json({ message: "Create at least 5 agents before uploading a list" });
    }

    // Parse, validate and distribute leads in sequential process
    const items = parseUpload(req.file);
    const allocations = distributeSequentially(items, agents);

    // Create distribution batch in database
    const batch = await DistributionBatch.create({
      fileName: req.file.originalname,
      totalItems: items.length,
      allocations
    });

    // Fetch batch with populated agent information for response
    const populatedBatch = await DistributionBatch.findById(batch._id).populate(
      "allocations.agent",
      "name email mobile"
    );

    // Return created batch with full details
    res.status(201).json(populatedBatch);
  } catch (error) {
    // Return error message (either from parseUpload or system error)
    res.status(400).json({ message: error.message || "Could not process uploaded file" });
  }
});

export default router;
