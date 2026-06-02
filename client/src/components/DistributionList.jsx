/**
 * Distribution List Component
 * Displays all distribution batches with allocation details
 * Shows which agent received which leads from each uploaded file
 * Provides a detailed view of the distribution history
 */

/**
 * DistributionList Component
 * @param {Array<Object>} distributions - Array of distribution batch objects
 *   Each batch contains: _id, fileName, totalItems, createdAt, allocations array
 *   Each allocation contains: agent (populated), items array
 *
 * @example
 * <DistributionList
 *   distributions={[
 *     {
 *       _id: "123",
 *       fileName: "leads.csv",
 *       totalItems: 12,
 *       createdAt: "2026-06-02T...",
 *       allocations: [
 *         {
 *           agent: { _id: "456", name: "John", email: "john@...", mobile: "+91..." },
 *           items: [{ firstName: "Alice", phone: "1234", notes: "VIP" }]
 *         }
 *       ]
 *     }
 *   ]}
 * />
 */
function DistributionList({ distributions }) {
  return (
    <div className="stack">
      {/* Render each distribution batch */}
      {distributions.map((batch) => (
        <article className="panel" key={batch._id}>
          {/* Batch header with filename and item count */}
          <div className="panel-title">
            <div>
              {/* Batch creation timestamp */}
              <p className="eyebrow">{new Date(batch.createdAt).toLocaleString()}</p>
              {/* Filename that was uploaded */}
              <h2>{batch.fileName}</h2>
            </div>
            {/* Total items badge */}
            <span className="badge">{batch.totalItems} items</span>
          </div>
          
          {/* Agent allocations grid */}
          <div className="allocation-grid">
            {/* Render each agent's allocation */}
            {batch.allocations.map((allocation) => (
              <div className="allocation" key={allocation.agent?._id}>
                {/* Agent header with item count */}
                <div className="allocation-head">
                  <strong>{allocation.agent?.name || "Deleted agent"}</strong>
                  <span>{allocation.items.length} items</span>
                </div>
                
                {/* Mini table showing agent's assigned items */}
                <div className="mini-table">
                  {/* Render each item assigned to this agent */}
                  {allocation.items.map((item, index) => (
                    <div className="mini-row" key={`${item.phone}-${index}`}>
                      {/* Item firstname, phone, and notes */}
                      <span>{item.firstName}</span>
                      <span>{item.phone}</span>
                      <span>{item.notes || "-"}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>
      ))}
      
      {/* Empty state message */}
      {!distributions.length && <div className="panel empty-panel">No uploaded lists yet.</div>}
    </div>
  );
}

export default DistributionList;

