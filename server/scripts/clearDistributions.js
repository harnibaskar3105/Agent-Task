/**
 * Clear Distributions Script
 * Deletes all distribution batches from the database
 * Keeps all User and Agent documents intact
 * Useful for resetting the system state while preserving agent configurations
 */

import dotenv from "dotenv";
import mongoose from "mongoose";
import DistributionBatch from "../src/models/DistributionBatch.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

async function clearDistributions() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      connectTimeoutMS: 8000
    });
    console.log("✓ Connected to MongoDB");

    // Delete all distribution batches
    const result = await DistributionBatch.deleteMany({});
    console.log(`✓ Deleted ${result.deletedCount} distribution batches`);

    // Verify deletion
    const remaining = await DistributionBatch.countDocuments();
    console.log(`✓ Distribution batches remaining: ${remaining}`);

    console.log("\n✓ Successfully cleared all distributed data!");
  } catch (error) {
    console.error("✗ Error clearing distributions:", error.message);
    process.exit(1);
  } finally {
    // Disconnect from database
    await mongoose.disconnect();
  }
}

clearDistributions();