/**
 * Agent Routes
 * CRUD operations for managing sales agents
 * All routes require JWT authentication via requireAuth middleware
 * Agents represent the sales team that receives distributed leads
 */

import express from "express";
import bcrypt from "bcryptjs";
import Agent from "../models/Agent.js";
import {
  isEmail,
  isMobileWithCountryCode,
  isStrongEnoughPassword
} from "../utils/validators.js";

const router = express.Router();

/**
 * GET /api/agents
 * Retrieves all agents sorted by creation date
 * Passwords are excluded from response for security
 *
 * Response: Array of agent objects
 * @example
 * [
 *   {
 *     "_id": "507f1f77bcf86cd799439011",
 *     "name": "John Doe",
 *     "email": "john@example.com",
 *     "mobile": "+919876543210",
 *     "createdAt": "2026-06-02T...",
 *     "updatedAt": "2026-06-02T..."
 *   }
 * ]
 */
router.get("/", async (_req, res) => {
  // Retrieve all agents sorted chronologically, exclude password field
  const agents = await Agent.find().sort({ createdAt: 1 }).select("-password");
  res.json(agents);
});

/**
 * POST /api/agents
 * Creates a new agent account
 *
 * Request body:
 *   - name (string, required): Agent's full name
 *   - email (string, required): Unique email address
 *   - mobile (string, required): Mobile with country code (e.g., +919876543210)
 *   - password (string, required): At least 6 characters
 *
 * Response on success (201): Created agent details without password
 * Response errors:
 *   - 400: Validation failed
 *   - 409: Email already in use
 *   - 500: Server error
 */
router.post("/", async (req, res) => {
  try {
    // Extract agent details from request
    const { name, email, mobile, password } = req.body;

    // Validate name is non-empty
    if (!name?.trim()) {
      return res.status(400).json({ message: "Agent name is required" });
    }

    // Validate email format
    if (!isEmail(email)) {
      return res.status(400).json({ message: "A valid agent email is required" });
    }

    // Validate mobile includes country code
    if (!isMobileWithCountryCode(mobile)) {
      return res.status(400).json({ message: "Mobile must include country code, example +919876543210" });
    }

    // Validate password meets minimum requirements
    if (!isStrongEnoughPassword(password)) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Hash password before storing (bcrypt with 10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new agent document in database
    const agent = await Agent.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      mobile: mobile.trim(),
      password: hashedPassword
    });

    // Return created agent without password
    res.status(201).json({
      id: agent._id,
      name: agent.name,
      email: agent.email,
      mobile: agent.mobile,
      createdAt: agent.createdAt
    });
  } catch (error) {
    // Handle duplicate email error (unique constraint violation)
    if (error.code === 11000) {
      return res.status(409).json({ message: "An agent with this email already exists" });
    }

    res.status(500).json({ message: "Could not create agent", error: error.message });
  }
});

/**
 * PUT /api/agents/:id
 * Updates an existing agent's information
 * Password is optional - only updated if provided
 *
 * URL parameter: id (MongoDB agent ID)
 * Request body (all optional except at least one field must be provided):
 *   - name (string): Agent's name
 *   - email (string): Agent's email
 *   - mobile (string): Agent's mobile with country code
 *   - password (string): New password (optional), at least 6 characters
 *
 * Response on success (200): Updated agent details without password
 * Response errors:
 *   - 400: Validation failed
 *   - 404: Agent not found
 *   - 409: New email already in use
 *   - 500: Server error
 */
router.put("/:id", async (req, res) => {
  try {
    // Extract update fields from request
    const { name, email, mobile, password } = req.body;

    // Validate required fields for update
    if (!name?.trim() || !isEmail(email) || !isMobileWithCountryCode(mobile)) {
      return res.status(400).json({ message: "Name, valid email and mobile are required" });
    }

    // Build update object with normalized data
    const update = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      mobile: mobile.trim()
    };

    // If password provided, validate and hash it
    if (password) {
      if (!isStrongEnoughPassword(password)) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
      update.password = await bcrypt.hash(password, 10);
    }

    // Update agent and return updated document (excluding password)
    const agent = await Agent.findByIdAndUpdate(req.params.id, update, {
      new: true,           // Return updated document
      runValidators: true  // Validate against schema
    }).select("-password");

    // Return 404 if agent doesn't exist
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    res.json(agent);
  } catch (error) {
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(409).json({ message: "An agent with this email already exists" });
    }

    res.status(500).json({ message: "Could not update agent", error: error.message });
  }
});

/**
 * DELETE /api/agents/:id
 * Permanently deletes an agent from the system
 * WARNING: This will disassociate any distributed leads from this agent
 *
 * URL parameter: id (MongoDB agent ID)
 * Response on success (200): Confirmation message
 * Response errors:
 *   - 404: Agent not found
 */
router.delete("/:id", async (req, res) => {
  // Find and delete agent by ID
  const agent = await Agent.findByIdAndDelete(req.params.id);

  // Return 404 if agent doesn't exist
  if (!agent) {
    return res.status(404).json({ message: "Agent not found" });
  }

  // Confirm deletion
  res.json({ message: "Agent deleted" });
});

export default router;

