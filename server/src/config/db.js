/**
 * Database Configuration Module
 * Handles MongoDB connection initialization using Mongoose
 * Connects to MongoDB Atlas or local MongoDB instance based on MONGO_URI env variable
 */

import mongoose from "mongoose";

/**
 * Establishes connection to MongoDB database
 * @async
 * @throws {Error} If MONGO_URI is not set in environment variables
 * @throws {Error} If MongoDB connection fails within 8 seconds timeout
 * @returns {Promise<void>} Resolves when MongoDB is connected
 */
export const connectDB = async () => {
  // Retrieve MongoDB connection URI from environment variables
  const uri = process.env.MONGO_URI;

  // Validate that the connection URI is provided
  if (!uri) {
    throw new Error("MONGO_URI is missing in the environment");
  }

  // Connect to MongoDB with 8-second timeout for server selection
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 8000
  });
  console.log("MongoDB connected");
};
