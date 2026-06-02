/**
 * Distribution Batch Model
 * Records each CSV/Excel upload and tracks how leads were distributed to agents
 * Provides full audit trail of distributions with item details per agent
 */

import mongoose from "mongoose";

/**
 * Distribution Item Schema
 * Represents a single lead/contact from the uploaded file
 * Immutable subdocument stored within agent allocations
 */
const distributionItemSchema = new mongoose.Schema(
  {
    // Lead's first name from the CSV
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    // Lead's phone number from the CSV
    phone: {
      type: String,
      required: true,
      trim: true
    },
    // Additional notes or context from the CSV
    notes: {
      type: String,
      default: "",
      trim: true
    }
  },
  { _id: false } // Don't generate separate IDs for items
);

/**
 * Agent Allocation Schema
 * Maps an agent to their assigned items from the batch
 * Enables efficient lookup of who gets which leads
 */
const agentAllocationSchema = new mongoose.Schema(
  {
    // Reference to the Agent document
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
      required: true
    },
    // Array of distribution items assigned to this agent
    items: {
      type: [distributionItemSchema],
      default: []
    }
  },
  { _id: false } // Don't generate separate IDs for allocations
);

/**
 * Distribution Batch Schema
 * Top-level document representing a single file upload event
 * Contains all allocation data in a single document for referential integrity
 */
const distributionBatchSchema = new mongoose.Schema(
  {
    // Original filename uploaded by admin
    fileName: {
      type: String,
      required: true
    },
    // Total number of items processed from this batch
    totalItems: {
      type: Number,
      required: true
    },
    // Array of agent allocations with their assigned items
    allocations: {
      type: [agentAllocationSchema],
      required: true
    }
  },
  { timestamps: true } // Tracks when batch was created/updated
);

export default mongoose.model("DistributionBatch", distributionBatchSchema);

