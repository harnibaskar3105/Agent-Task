/**
 * Main Application Component
 * React application shell with authentication, navigation, and state management
 * Handles login flow, navigation between pages, and data fetching from API
 * Uses local state for navigation (lightweight, no router needed)
 */

import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { LayoutDashboard, LogOut, RefreshCw, Upload, Users } from "lucide-react";
import { apiRequest } from "./api/client.js";
import Agents from "./pages/Agents.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import UploadList from "./pages/UploadList.jsx";
import "./styles.css";

/**
 * App Component - Main application shell
 * Manages authentication state, page navigation, and data loading
 */
function App() {
  // Authentication state - user object if logged in, null if logged out
  // Initialize from localStorage token if present
  const [user, setUser] = useState(() =>
    localStorage.getItem("token") ? { role: "admin" } : null
  );
  
  // Current page view (dashboard, agents, upload)
  const [view, setView] = useState("dashboard");
  
  // Data state
  const [agents, setAgents] = useState([]);
  const [distributions, setDistributions] = useState([]);
  const [summary, setSummary] = useState({
    agentCount: 0,
    batchCount: 0,
    totalItems: 0
  });
  
  // Error message from API calls
  const [error, setError] = useState("");

  /**
   * Load all protected data from API
   * Fetches agents, distributions, and dashboard summary
   * Only runs if user is authenticated (token exists)
   */
  const loadData = async () => {
    // Skip if not authenticated
    if (!localStorage.getItem("token")) return;
    
    setError("");

    try {
      // Fetch all data in parallel
      const [agentsData, distributionsData, summaryData] = await Promise.all([
        apiRequest("/agents"),
        apiRequest("/distributions"),
        apiRequest("/dashboard/summary")
      ]);
      
      // Update state with fetched data
      setAgents(agentsData);
      setDistributions(distributionsData);
      setSummary(summaryData);
    } catch (requestError) {
      // Display error message
      setError(requestError.message);
    }
  };

  // Load data when user logs in or out
  useEffect(() => {
    loadData();
  }, [user]);

  // Navigation items for sidebar menu (memoized to avoid recreating on every render)
  const navItems = useMemo(
    () => [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "agents", label: "Agents", icon: Users },
      { id: "upload", label: "Upload", icon: Upload }
    ],
    []
  );

  // Get page title based on current view
  const pageTitle = {
    dashboard: "Overview",
    agents: "Agent management",
    upload: "Upload list"
  }[view];

  // Show login page if not authenticated
  if (!user) {
    return <Login onLogin={setUser} />;
  }

  // Main app layout with sidebar and main content
  return (
    <div className="app-shell">
      {/* Sidebar navigation */}
      <aside className="sidebar">
        {/* App branding */}
        <div>
          <p className="eyebrow">Agent Task</p>
          <h1>Distributor</h1>
        </div>
        
        {/* Navigation menu */}
        <nav>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={view === item.id ? "nav-active" : ""}
                onClick={() => setView(item.id)}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>
        
        {/* Logout button */}
        <button
          className="logout-button"
          onClick={() => {
            // Clear token and reset user state
            localStorage.removeItem("token");
            setUser(null);
          }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>
      
      {/* Main content area */}
      <main className="main">
        {/* Top header bar */}
        <header className="topbar">
          <div>
            <p className="eyebrow">Admin dashboard</p>
            <h1>{pageTitle}</h1>
          </div>
          {/* Refresh button to reload all data */}
          <button className="icon-button" onClick={loadData} title="Refresh">
            <RefreshCw size={18} />
          </button>
        </header>
        
        {/* Error message banner if API call fails */}
        {error && <p className="error banner">{error}</p>}
        
        {/* Render current page based on view state */}
        {view === "dashboard" && (
          <Dashboard summary={summary} distributions={distributions} />
        )}
        {view === "agents" && <Agents agents={agents} refreshAgents={loadData} />}
        {view === "upload" && (
          <UploadList
            agents={agents}
            distributions={distributions}
            refreshAll={loadData}
          />
        )}
      </main>
    </div>
  );
}

// Render React app into DOM root
createRoot(document.getElementById("root")).render(<App />);
