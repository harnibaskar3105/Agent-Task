/**
 * Password Input Component
 * Reusable password input field with show/hide toggle
 * Displays password as dots by default, toggles to plain text on button click
 * Includes accessibility features (aria-label, title) for better UX
 */

import { useState } from "react";
import closeEyeIcon from "../assets/close-eye.png";
import openEyeIcon from "../assets/open-eye.png";

/**
 * PasswordInput Component
 * @param {string} value - Current password value (controlled input)
 * @param {Function} onChange - Callback when password changes
 * @param {string} placeholder - Placeholder text for empty input
 * @param {boolean} required - Whether field is required
 * @returns {JSX.Element} Password input with toggle button
 *
 * @example
 * const [password, setPassword] = useState("");
 * <PasswordInput
 *   value={password}
 *   onChange={(e) => setPassword(e.target.value)}
 *   placeholder="Enter password"
 *   required={true}
 * />
 */
function PasswordInput({ value, onChange, placeholder = "", required = false }) {
  // Track whether password is visible or hidden
  const [visible, setVisible] = useState(false);

  return (
    <div className="password-control">
      {/* Input field: switches between password and text type */}
      <input
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
      {/* Toggle button to show/hide password */}
      <button
        type="button"
        className="password-toggle"
        onClick={() => setVisible((current) => !current)}
        title={visible ? "Hide password" : "Show password"}
        aria-label={visible ? "Hide password" : "Show password"}
      >
        <img src={visible ? openEyeIcon : closeEyeIcon} alt="" />
      </button>
    </div>
  );
}

export default PasswordInput;

