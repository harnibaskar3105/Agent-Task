/**
 * Authentication Middleware
 * Validates JWT tokens from Authorization header
 * Protects API routes that require authenticated admin access
 */

import jwt from "jsonwebtoken";

/**
 * JWT Authentication Middleware
 * Verifies the JWT token in the Authorization header and extracts user info
 * Used as Express middleware to protect private routes
 *
 * Expected header format: "Authorization: Bearer <token>"
 * Tokens are verified against JWT_SECRET and checked for expiration
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} Calls next() if valid, or returns 401 error response
 *
 * @example
 * // Protect routes like this:
 * router.get("/agents", requireAuth, (req, res) => {
 *   // req.user contains: { id, email, role }
 * });
 */
export const requireAuth = (req, res, next) => {
  // Extract Authorization header
  const header = req.headers.authorization || "";
  
  // Extract token: "Bearer <token>" → <token>
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  // Protected API routes expect the JWT in the Authorization header
  if (!token) {
    return res.status(401).json({ message: "Authentication token is required" });
  }

  try {
    // Verify and decode the token
    // jwt.verify throws an error if token is invalid or expired
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    
    // Token is valid, proceed to next middleware/route handler
    next();
  } catch {
    // Token verification failed (invalid signature or expired)
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
