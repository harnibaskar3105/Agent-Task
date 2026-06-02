/**
 * Upload List Page
 * File upload and CSV/Excel distribution interface
 * Allows admin to upload lead lists and automatically distribute to agents
 * Displays all previous distributions and their allocations
 */

import { useState } from "react";
import { FileSpreadsheet, Upload } from "lucide-react";
import { apiRequest } from "../api/client.js";
import DistributionList from "../components/DistributionList.jsx";

/**
 * UploadList Component
 * @param {Array<Object>} agents - All available agents (must have 5+ to enable upload)
 * @param {Array<Object>} distributions - Previous distribution batches
 * @param {Function} refreshAll - Callback to refresh all data after upload
 */
function UploadList({ agents, distributions, refreshAll }) {
  // Selected file to upload
  const [file, setFile] = useState(null);
  // Message for feedback (error/success)
  const [message, setMessage] = useState("");
  // Loading state during upload
  const [loading, setLoading] = useState(false);

  // Handle file upload and distribution
  const uploadFile = async (event) => {
    event.preventDefault();
    setMessage("");

    // Validate file is selected
    if (!file) {
      setMessage("Choose a csv, xlsx, xls or axls file");
      return;
    }

    // Prepare FormData for file upload (Multer expects "file" field)
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);

    try {
      // Send file to backend for processing and distribution
      await apiRequest("/distributions/upload", {
        method: "POST",
        body: formData
      });
      
      // Clear file after successful upload
      setFile(null);
      // Show success message
      setMessage("File uploaded and distributed successfully");
      // Refresh all data to show new distribution
      refreshAll();
    } catch (error) {
      // Display error message
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="stack">
      {/* Upload form panel */}
      <form className="panel upload-panel" onSubmit={uploadFile}>
        {/* Panel header */}
        <div className="panel-title">
          <div>
            <p className="eyebrow">Upload</p>
            <h2>Distribute list</h2>
          </div>
          <FileSpreadsheet size={28} />
        </div>
        
        {/* File input - accepts CSV and Excel formats */}
        <input
          type="file"
          accept=".csv,.xlsx,.xls,.axls"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
        />
        
        {/* Submit button - disabled if less than 5 agents or uploading */}
        <button
          className="primary-button"
          type="submit"
          disabled={loading || agents.length < 5}
        >
          <Upload size={18} />
          {loading ? "Uploading..." : "Upload and distribute"}
        </button>
        
        {/* Message display - success or error styling */}
        <p className={message.includes("success") ? "success" : "error"}>{message}</p>
        
        {/* Warning if insufficient agents */}
        {agents.length < 5 && (
          <p className="muted">Create at least 5 agents to enable distribution.</p>
        )}
        
        {/* Supported format hint */}
        <p className="muted">Upload in the format : CSV, XLSX, XLS or AXLS</p>
      </form>
      
      {/* Display all distributions */}
      <DistributionList distributions={distributions} />
    </section>
  );
}

export default UploadList;
