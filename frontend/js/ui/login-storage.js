/**
 * LOGIN STORAGE
 * Handles localStorage for user credentials
 * File: frontend/js/ui/login-storage.js
 */

// Local storage key for remembering user
const STORAGE_KEY = 'talkcache_user';

/**
 * Get saved user credentials from localStorage
 * @returns {Object|null} Saved user data or null
 */
function getSavedUser() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

/**
 * Save user credentials to localStorage
 * @param {string} username - Username to save
 * @param {string} password - Password to save
 */
function saveUser(username, password) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ username, password }));
  } catch (error) {
    console.error('Error saving user:', error);
  }
}

/**
 * Clear saved user from localStorage
 */
function clearSavedUser() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing user:', error);
  }
}

/**
 * Check if user has saved credentials
 * @returns {boolean} True if user is saved
 */
function hasSavedUser() {
  return !!getSavedUser();
}

export {
  getSavedUser,
  saveUser,
  clearSavedUser,
  hasSavedUser
};
