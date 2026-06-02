/**
 * Agent Form Component
 * Handles both creation of new agents and editing existing agents
 * Provides form validation and API communication for agent management
 * Supports optional password field during edit (password can be left blank to keep current)
 */

import { useEffect, useState } from "react";
import { Plus, Save, X } from "lucide-react";
import { apiRequest } from "../api/client.js";
import PasswordInput from "./PasswordInput.jsx";

// Default form state for new agent
const emptyAgent = {
  name: "",
  email: "",
  mobile: "",
  password: ""
};

/**
 * AgentForm Component
 * @param {Object} editingAgent - Agent object if editing, null for creation
 * @param {Function} onSaved - Callback when agent is successfully saved
 * @param {Function} onCancel - Callback to cancel editing mode
 *
 * Features:
 * - Dual mode: create new or edit existing agent
 * - Password field required for new agents, optional for edits
 * - Displays success/error messages
 * - Clears form after successful submission
 * - Shows loading state during API call
 */
function AgentForm({ onSaved, editingAgent, onCancel }) {
  // Form state with name, email, mobile, password
  const [form, setForm] = useState(emptyAgent);
  // Message for success/error feedback
  const [message, setMessage] = useState("");
  // Loading state to disable submit button
  const [loading, setLoading] = useState(false);

  // When editingAgent changes, populate form or reset to empty
  useEffect(() => {
    if (editingAgent) {
      // Pre-populate form with agent data (clear password for security)
      setForm({ ...editingAgent, password: "" });
    } else {
      // Reset form for new agent creation
      setForm(emptyAgent);
    }
  }, [editingAgent]);

  // Handle form submission (create or update agent)
  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Determine API path and method based on edit or create mode
      const path = editingAgent ? `/agents/${editingAgent._id}` : "/agents";
      const method = editingAgent ? "PUT" : "POST";
      
      // Password is optional while editing, so blank values keep the old hash
      const payload = {
        name: form.name,
        email: form.email,
        mobile: form.mobile,
        ...(form.password ? { password: form.password } : {})
      };

      // Send request to API
      await apiRequest(path, {
        method,
        body: JSON.stringify(payload)
      });
      
      // Clear form on success
      setForm(emptyAgent);
      // Notify parent component
      onSaved();
    } catch (error) {
      // Display error message
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="panel form-grid">
      <div className="panel-title">
        <div>
          <p className="eyebrow">{editingAgent ? "Update" : "Create"}</p>
          <h2>{editingAgent ? "Edit agent" : "Add agent"}</h2>
        </div>
        {/* Cancel button visible only in edit mode */}
        {editingAgent && (
          <button type="button" className="icon-button" onClick={onCancel} title="Cancel edit">
            <X size={18} />
          </button>
        )}
      </div>
      
      {/* Name field */}
      <label>
        Name
        <input
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          required
        />
      </label>
      
      {/* Email field */}
      <label>
        Email
        <input
          type="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          required
        />
      </label>
      
      {/* Mobile field - should include country code */}
      <label>
        Mobile number with country code
        <input
          value={form.mobile}
          onChange={(event) => setForm({ ...form, mobile: event.target.value })}
          required
        />
      </label>
      
      {/* Password field - required for new agents, optional for edits */}
      <label>
        Password
        <PasswordInput
          placeholder={editingAgent ? "Leave blank to keep current password" : ""}
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          required={!editingAgent}
        />
      </label>
      
      {/* Error/success message display */}
      {message && <p className="error full-width">{message}</p>}
      
      {/* Submit button - shows different text and icon based on mode */}
      <button className="primary-button full-width" type="submit" disabled={loading}>
        {editingAgent ? <Save size={18} /> : <Plus size={18} />}
        {loading ? "Saving..." : editingAgent ? "Save changes" : "Add agent"}
      </button>
    </form>
  );
}

export default AgentForm;
