/**
 * LOGIN SCREEN
 * Handles the username and password input
 */

// Import helper functions
import { $, on, escapeHtml, isValidUsername } from '../utils/helpers.js';
import { setUsername, setJoined } from '../state.js';

// DOM elements (cached for performance)
let elements = {};

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

/**
 * Get references to DOM elements
 */
function initElements() {
  elements = {
    loginScreen: $('#login-screen'),
    chatInterface: $('#chat-interface'),
    loginForm: $('#login-form'),
    usernameInput: $('#username-input'),
    passwordInput: $('#password-input'),
    joinBtn: $('#join-btn'),
    displayUsername: $('#display-username')
  };

  // Debug: Check if all elements are found
  console.log('[Login] Elements found:', {
    loginScreen: !!elements.loginScreen,
    chatInterface: !!elements.chatInterface,
    loginForm: !!elements.loginForm,
    usernameInput: !!elements.usernameInput,
    passwordInput: !!elements.passwordInput,
    joinBtn: !!elements.joinBtn,
    displayUsername: !!elements.displayUsername
  });
}

// =============================================
// SCREEN VISIBILITY
// =============================================

function hideLoginScreen() {
  elements.loginScreen?.classList.add('hidden');
  elements.chatInterface?.classList.remove('hidden');
}

// =============================================
// FORM HANDLING
// =============================================

/**
 * Get username input
 */
function getUsernameInput() {
  return elements.usernameInput?.value?.trim() || '';
}

/**
 * Get password input
 */
function getPasswordInput() {
  return elements.passwordInput?.value?.trim() || '';
}

/**
 * Check if username and password are valid
 */
function validateLoginInput() {
  const username = getUsernameInput();
  const password = getPasswordInput();

  if (!username || !password) {
    return false;
  }

  if (!isValidUsername(username)) {
    return false;
  }

  // Password must be at least 1 character, max 50
  if (password.length < 1 || password.length > 50) {
    return false;
  }

  return true;
}

/**
 * Enable or disable join button based on input
 */
function updateJoinButtonState() {
  const username = getUsernameInput();
  const password = getPasswordInput();
  if (elements.joinBtn) {
    elements.joinBtn.disabled = !username || !password;
  }
}

/**
 * Handle form submission
 */
function handleLoginSubmit(onJoin) {
  return function(event) {
    event.preventDefault();
    console.log('[Login] Form submitted!');

    // Validate
    if (!validateLoginInput()) {
      console.log('[Login] Validation failed');
      return;
    }

    const username = getUsernameInput();
    const password = getPasswordInput();

    console.log('[Login] Username:', username);

    // Call the join callback with credentials
    if (typeof onJoin === 'function') {
      console.log('[Login] Calling onJoin callback');
      onJoin({ username, password });
    }

    console.log('[Login] Login initiated!');
  };
}

// =============================================
// INITIALIZATION
// =============================================

/**
 * Set up the login screen
 * @param {Function} onJoin - What to do when user joins
 */
function initLogin(onJoin) {
  initElements();

  // Handle form submit
  if (elements.loginForm) {
    on(elements.loginForm, 'submit', handleLoginSubmit(onJoin));
  }

  // Update button when user types
  if (elements.usernameInput) {
    on(elements.usernameInput, 'input', updateJoinButtonState);
  }

  // Update button when password changes
  if (elements.passwordInput) {
    on(elements.passwordInput, 'input', updateJoinButtonState);
  }

  // Check for saved user and auto-fill both username and password
  const savedUser = getSavedUser();
  if (savedUser && savedUser.username && savedUser.password) {
    if (elements.usernameInput) {
      elements.usernameInput.value = savedUser.username;
    }
    if (elements.passwordInput) {
      elements.passwordInput.value = savedUser.password;
    }
    updateJoinButtonState();
    // Button is now enabled, ready to auto-login
    return { autoLogin: true, credentials: savedUser };
  } else if (savedUser && savedUser.username) {
    // Only username saved, not password
    if (elements.usernameInput) {
      elements.usernameInput.value = savedUser.username;
    }
    updateJoinButtonState();
    elements.passwordInput?.focus();
  } else {
    elements.usernameInput?.focus();
  }

  // Start with button disabled
  updateJoinButtonState();
  return { autoLogin: false };

  console.log('[Login] Ready');
}

// Export functions
export {
  initLogin,
  hideLoginScreen,
  getUsernameInput,
  getPasswordInput,
  saveUser,
  clearSavedUser,
  getSavedUser,
  hasSavedUser
};
