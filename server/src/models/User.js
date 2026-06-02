/**
 * User Model
 * Represents admin users in the system
 * Stores authentication credentials for portal access
 */

import mongoose from "mongoose";

/**
 * User Schema Definition
 * Fields:
 *   - email: Unique identifier for authentication, normalized to lowercase
 *   - password: Hashed password (never stored in plain text)
 *   - role: User role (currently only "admin" is supported)
 *   - timestamps: Automatic createdAt and updatedAt fields
 */
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["admin"],
      default: "admin"
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);

