/**
 * Agents Page
 * Manage sales agents - create, edit, and delete agent accounts
 * Enforces minimum requirement of 5 agents for distribution
 * Displays all agents in a table with edit/delete actions
 */

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { apiRequest } from "../api/client.js";
import AgentForm from "../components/AgentForm.jsx";

/**
 * Agents Component
 * @param {Array<Object>} agents - Array of all agent objects
 * @param {Function} refreshAgents - Callback to refresh agents list from server
 */
function Agents({ agents, refreshAgents }) {
  // Track which agent is being edited (null for creation mode)
  const [editingAgent, setEditingAgent] = useState(null);

  // Delete an agent after confirmation
  const removeAgent = async (id) => {
    // Show confirmation dialog
    if (!confirm("Delete this agent?")) return;
    
    // Send delete request
    await apiRequest(`/agents/${id}`, { method: "DELETE" });
    
    // Refresh agents list
    refreshAgents();
  };

  return (
    <section className="content-grid">
      {/* Agent creation/edit form */}
      <AgentForm
        editingAgent={editingAgent}
        onCancel={() => setEditingAgent(null)}
        onSaved={() => {
          setEditingAgent(null);
          refreshAgents();
        }}
      />
      
      {/* Agents list panel */}
      <div className="panel">
        <div className="panel-title">
          <div>
            <p className="eyebrow">Team</p>
            <h2>Agents</h2>
          </div>
          {/* Badge showing current agents vs minimum required (5) */}
          <span className="badge">{agents.length}/5 minimum</span>
        </div>
        
        {/* Agents table */}
        <div className="table-wrap">
          <table>
            {/* Table header */}
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th></th>
              </tr>
            </thead>
            
            {/* Table body */}
            <tbody>
              {/* Render each agent row */}
              {agents.map((agent) => (
                <tr key={agent._id}>
                  <td>{agent.name}</td>
                  <td>{agent.email}</td>
                  <td>{agent.mobile}</td>
                  {/* Action buttons: edit and delete */}
                  <td className="actions">
                    {/* Edit button */}
                    <button
                      className="icon-button"
                      onClick={() => setEditingAgent(agent)}
                      title="Edit agent"
                    >
                      <Pencil size={17} />
                    </button>
                    {/* Delete button */}
                    <button
                      className="icon-button danger"
                      onClick={() => removeAgent(agent._id)}
                      title="Delete agent"
                    >
                      <Trash2 size={17} />
                    </button>
                  </td>
                </tr>
              ))}
              
              {/* Empty state when no agents */}
              {!agents.length && (
                <tr>
                  <td colSpan="4" className="empty-cell">
                    No agents yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default Agents;

