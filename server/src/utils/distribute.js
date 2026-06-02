/**
 * Distribution Algorithm Module
 * Implements round-robin sequential distribution of leads to agents
 * Ensures fair and balanced workload across exactly 5 agents
 */

/**
 * Distributes items sequentially across 5 agents using round-robin
 * Each agent gets an equal share of items (or within 1 item of equal share)
 * 
 * Algorithm: Items are assigned in order to agents 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, ...
 * This ensures:
 * - Agent 1 gets items 0, 5, 10, 15, ... (every 5th)
 * - Agent 2 gets items 1, 6, 11, 16, ... (every 5th offset by 1)
 * - And so on for balanced distribution
 *
 * @param {Array<Object>} items - Array of distribution items (leads) from CSV/Excel
 * @param {Array<Object>} agents - Array of all agent documents from database
 * @returns {Array<Object>} Array of allocations with agent ID and assigned items
 *
 * @example
 * // 12 items distributed to 5 agents results in:
 * // Agent 1: 3 items (indices 0, 5, 10)
 * // Agent 2: 3 items (indices 1, 6, 11)
 * // Agent 3: 2 items (indices 2, 7)
 * // Agent 4: 2 items (indices 3, 8)
 * // Agent 5: 2 items (indices 4, 9)
 */
export const distributeSequentially = (items, agents) => {
  // Use only the first 5 agents (hard requirement)
  const selectedAgents = agents.slice(0, 5);
  
  // Initialize allocation structure with empty item arrays for each agent
  const allocations = selectedAgents.map((agent) => ({
    agent: agent._id,
    items: []
  }));

  // Round-robin assignment: assign each item to agents in sequence
  items.forEach((item, index) => {
    allocations[index % selectedAgents.length].items.push(item);
  });

  return allocations;
};
