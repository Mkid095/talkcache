/**
 * SIDEBAR COLORS
 * Color utilities for sidebar
 * File: frontend/js/ui/sidebar/sidebar-colors.js
 */

// Color palette for users - must match backend
const USER_COLORS = [
  '#e74c3c', '#9b59b6', '#3498db', '#1abc9c', '#f39c12',
  '#e67e22', '#16a085', '#27ae60', '#2980b9', '#8e44ad',
  '#2c3e50', '#f1c40f', '#e67e22', '#d35400', '#c0392b'
];

/**
 * Get a consistent color for a username
 * @param {string} username - Username
 * @returns {string} Hex color code
 */
function getUserColor(username) {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % USER_COLORS.length;
  return USER_COLORS[index];
}

export { USER_COLORS, getUserColor };
