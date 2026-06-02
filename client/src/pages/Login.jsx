/**
 * Login Page
 * Admin authentication page for accessing the agent distributor system
 * Pre-filled with demo credentials for easy testing
 * Validates email and password, stores JWT token in localStorage
 */

import { useState } from "react";
import { apiRequest } from "../api/client.js";
import PasswordInput from "../components/PasswordInput.jsx";

/**
 * Login Component
 * @param {Function} onLogin - Callback to update app state when login successful
 *
 * @example
 * <Login onLogin={(user) => setUser(user)} />
 */
function Login({ onLogin }) {
  // Form state with pre-filled demo credentials
  const [form, setForm] = useState({
    email: "admin@example.com",
    password: "Admin@12345"
  });
  // Message for display (error/success feedback)
  const [message, setMessage] = useState("");
  // Loading state to disable submit button
  const [loading, setLoading] = useState(false);

  // Handle form submission - login with email/password
  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Send login request to backend
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(form)
      });
      
      // Store JWT token in browser storage
      localStorage.setItem("token", data.token);
      
      // Notify parent component of successful login
      onLogin(data.user);
    } catch (error) {
      // Display error message if login fails
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-shell">
      <section className="login-panel">
        {/* Login page header */}
        <div>
          <p className="eyebrow">Admin portal</p>
          <h1>Agent List Distributor</h1>
          <p className="muted">Sign in to manage agents, upload lead lists and review assignments.</p>
        </div>
        
        {/* Login form */}
        <form onSubmit={submit} className="form-stack">
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
          
          {/* Password field with show/hide toggle */}
          <label>
            Password
            <PasswordInput
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
            />
          </label>
          
          {/* Error message display */}
          {message && <p className="error">{message}</p>}
          
          {/* Submit button */}
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;

