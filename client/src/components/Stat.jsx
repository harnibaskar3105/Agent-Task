/**
 * Stat Component
 * Displays a single statistic metric on the dashboard
 * Shows a label and its corresponding numeric value
 *
 * @param {string} label - The statistic label (e.g., "Agents", "Uploaded batches")
 * @param {number} value - The numeric value to display
 *
 * @example
 * <Stat label="Agents" value={5} />
 * <Stat label="Distributed items" value={50} />
 */
function Stat({ label, value }) {
  return (
    <div className="stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default Stat;

