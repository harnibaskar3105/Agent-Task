/**
 * Dashboard Page
 * Admin overview dashboard showing key statistics and latest distribution
 * Displays agents count, batch count, total items, and most recent distribution
 * Provides a quick snapshot of the system status
 */

import DistributionList from "../components/DistributionList.jsx";
import Stat from "../components/Stat.jsx";

/**
 * Dashboard Component
 * @param {Object} summary - Dashboard statistics object
 *   - agentCount: Total number of agents
 *   - batchCount: Total number of batches uploaded
 *   - totalItems: Total items distributed across all batches
 * @param {Array<Object>} distributions - Array of all distribution batches (sorted newest first)
 */
function Dashboard({ summary, distributions }) {
  // Get the most recent batch (first in array)
  const latestBatch = distributions[0];

  return (
    <section className="stack">
      {/* Statistics Grid: Shows key metrics */}
      <div className="stats-grid">
        {/* Total agents count */}
        <Stat label="Agents" value={summary.agentCount} />
        {/* Total batches uploaded */}
        <Stat label="Uploaded batches" value={summary.batchCount} />
        {/* Total items distributed */}
        <Stat label="Distributed items" value={summary.totalItems} />
      </div>
      
      {/* Display latest distribution or empty state */}
      {latestBatch ? (
        // Show the most recent batch with its allocations
        <DistributionList distributions={[latestBatch]} />
      ) : (
        // Empty state when no distributions yet
        <div className="panel">
          <div className="panel-title">
            <div>
              <p className="eyebrow">Latest</p>
              <h2>Recent distribution</h2>
            </div>
          </div>
          <p className="muted">Upload a list to see assignments here.</p>
        </div>
      )}
    </section>
  );
}

export default Dashboard;

