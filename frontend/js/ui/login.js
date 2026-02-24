/**
 * LOGIN SCREEN
 * Handles the username and password input
 * File: frontend/js/ui/login.js
 */

import { $, on, escapeHtml, isValidUsername } from '../utils/helpers.js';
import { setUsername, setJoined } from '../state.js';
import {
  getSavedUser,
  saveUser,
  clearSavedUser,
  hasSavedUser
} from './login-storage.js';

// DOM elements (cached for performance)
let elements = {};

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

    if (!validateLoginInput()) {
      console.log('[Login] Validation failed');
      return;
    }

    const username = getUsernameInput();
    const password = getPasswordInput();

    console.log('[Login] Username:', username);

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

  if (elements.passwordInput) {
    on(elements.passwordInput, 'input', updateJoinButtonState);
  }

  // Always focus on username input (no auto-fill)
  elements.usernameInput?.focus();

  console.log('[Login] Ready');
}

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
