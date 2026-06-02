/**
 * Agent Model
 * Represents sales agents in the system
 * Each agent receives distributed leads from uploaded CSV files
 * Stores agent profile and authentication information
 */

import mongoose from "mongoose";

/**
 * Agent Schema Definition
 * Fields:
 *   - name: Agent's full name
 *   - email: Unique agent email for identification and potential authentication
 *   - mobile: Contact number with country code (e.g., +919876543210)
 *   - password: Hashed password for potential future agent portal
 *   - timestamps: Automatic createdAt and updatedAt for audit trail
 */
const agentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    mobile: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Agent", agentSchema);

