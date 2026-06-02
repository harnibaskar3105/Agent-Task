/**
 * Authentication Routes
 * Handles admin user login and JWT token generation
 * Entry point for portal authentication
 */

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { isEmail } from "../utils/validators.js";

const router = express.Router();

/**
 * POST /api/auth/login
 * Authenticates admin user with email and password
 * Returns JWT token and user details on success
 *
 * Request body:
 *   - email (string): Admin email address
 *   - password (string): Admin password (at least 6 characters)
 *
 * Response on success (200):
 *   - token (string): JWT token valid for 24 hours
 *   - user (object): User details { id, email, role }
 *
 * Response errors:
 *   - 400: Missing or invalid credentials
 *   - 401: Invalid email or password
 *   - 500: Server error during authentication
 *
 * @example
 * // Request
 * POST /api/auth/login
 * { "email": "admin@example.com", "password": "Admin@12345" }
 *
 * // Response
 * {
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "user": { "id": "123", "email": "admin@example.com", "role": "admin" }
 * }
 */
router.post("/login", async (req, res) => {
  try {
    // Extract credentials from request body
    const { email, password } = req.body;

    // Validate input: email format and password presence
    if (!isEmail(email) || !password) {
      return res.status(400).json({ message: "Valid email and password are required" });
    }

    // Query database for user with matching email (case-insensitive and trimmed)
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Verify user exists and password matches (bcrypt comparison is constant-time)
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token valid for 24 hours
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Return token and user details to client
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    // Handle unexpected server errors
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

export default router;

