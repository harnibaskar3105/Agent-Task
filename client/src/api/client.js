/**
 * API Client Module
 * Handles all HTTP requests to the backend API
 * Manages JWT token authentication and error handling
 * Centralizes API configuration and request logic
 */

// Base API URL from environment or default to local development server
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Generic API request function
 * Handles authentication tokens, error responses, and request formatting
 * Supports both JSON and FormData (for file uploads)
 *
 * @param {string} path - API endpoint path (e.g., "/agents", "/distributions/upload")
 * @param {Object} options - Request options (method, body, headers, etc.)
 * @param {string} options.method - HTTP method (GET, POST, PUT, DELETE)
 * @param {Object|FormData} options.body - Request body (object or FormData for files)
 * @param {Object} options.headers - Additional headers to include
 *
 * @returns {Promise<Object>} Parsed JSON response from server
 * @throws {Error} With message from server or network error
 *
 * @example
 * // GET request
 * const agents = await apiRequest("/agents");
 *
 * // POST with JSON
 * const result = await apiRequest("/agents", {
 *   method: "POST",
 *   body: JSON.stringify({ name: "John", email: "john@example.com" })
 * });
 *
 * // POST with file upload
 * const formData = new FormData();
 * formData.append("file", fileObject);
 * const batch = await apiRequest("/distributions/upload", {
 *   method: "POST",
 *   body: formData
 * });
 */
export const apiRequest = async (path, options = {}) => {
  // Retrieve JWT token from local storage
  const token = localStorage.getItem("token");
  
  // Build headers with Content-Type (skip for FormData) and Authorization
  const headers = {
    // Only set Content-Type for JSON requests, not for FormData
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    // Include JWT token in Authorization header if available
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    // Merge any additional headers provided
    ...options.headers
  };

  let response;

  try {
    // Perform fetch request to API endpoint
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers
    });
  } catch {
    // Network error or CORS issue - backend is not reachable
    throw new Error("Backend is not running. Start MongoDB, then run npm run server.");
  }

  // Parse response as JSON (with fallback to empty object if parsing fails)
  const data = await response.json().catch(() => ({}));

  // Check for HTTP error status
  if (!response.ok) {
    // Throw error with server message or generic fallback
    throw new Error(data.message || "Request failed");
  }

  // Return parsed response data
  return data;
};
