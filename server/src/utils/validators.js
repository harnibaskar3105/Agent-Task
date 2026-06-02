/**
 * Input Validation Utilities
 * Provides reusable validation functions for common data types
 * Ensures data integrity across authentication and form submissions
 */

/**
 * Validates email format
 * @param {*} value - Value to validate
 * @returns {boolean} True if value matches email pattern, false otherwise
 */
export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

/**
 * Validates password strength (minimum 6 characters)
 * @param {*} value - Password string to validate
 * @returns {boolean} True if password is at least 6 characters, false otherwise
 */
export const isStrongEnoughPassword = (value) =>
  typeof value === "string" && value.trim().length >= 6;

/**
 * Validates mobile number with international country code
 * Accepts +1 to +9 followed by 8-15 digits (ITU-T E.164 format)
 * Examples: +919876543210, +11234567890
 * @param {*} value - Mobile number to validate
 * @returns {boolean} True if format is valid, false otherwise
 */
export const isMobileWithCountryCode = (value) =>
  /^\+[1-9]\d{7,14}$/.test(String(value || "").trim());

/**
 * Normalizes header names from CSV/Excel files
 * Converts to lowercase, removes spaces/underscores/hyphens for flexible matching
 * Examples: "First Name" → "firstname", "first_name" → "firstname"
 * @param {*} value - Header value to normalize
 * @returns {string} Normalized header string
 */
export const normalizeHeader = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]/g, "");

