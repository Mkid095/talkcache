/**
 * CLIENT-SIDE ROUTER
 * Handles URL-based routing for state persistence
 * File: frontend/js/router.js
 */

// Import state functions
import {
  getUsername,
  hasJoined,
  setJoined,
  setUsername
} from './state.js';

import { getSavedUser, clearSavedUser } from './ui/login.js';

// DOM elements
let elements = {};

/**
 * Get DOM element references
 */
function initElements() {
  elements = {
    loginScreen: document.getElementById('login-screen'),
    chatInterface: document.getElementById('chat-interface')
  };
}

/**
 * Route definitions
 */
const ROUTES = {
  LOGIN: '/login',
  CHAT: '/chat'
};

/**
 * Current route state
 */
let currentRoute = ROUTES.LOGIN;

/**
 * Update the visible screen based on state
 */
function updateScreen() {
  initElements();

  const isLoggedIn = hasJoined();
  const savedUser = getSavedUser();
  const hasCredentials = savedUser && savedUser.username;

  const shouldShowChat = (isLoggedIn && hasCredentials) || (currentRoute === ROUTES.CHAT && hasCredentials);

  if (elements.loginScreen && elements.chatInterface) {
    if (shouldShowChat && hasCredentials) {
      elements.loginScreen.classList.add('hidden');
      elements.chatInterface.classList.remove('hidden');
    } else {
      elements.loginScreen.classList.remove('hidden');
      elements.chatInterface.classList.add('hidden');
    }
  }
}

/**
 * Initialize the router
 * @param {Object} options - Configuration options (unused - auto-login removed)
 */
function initRouter(options = {}) {
  initElements();

  // Determine initial route from URL
  const pathname = window.location.pathname;

  if (pathname === ROUTES.CHAT) {
    currentRoute = ROUTES.CHAT;
  } else {
    currentRoute = ROUTES.LOGIN;
  }

  // Handle browser back/forward buttons
  window.addEventListener('popstate', () => {
    const pathname = window.location.pathname;
    currentRoute = pathname === ROUTES.CHAT ? ROUTES.CHAT : ROUTES.LOGIN;
    updateScreen();
  });

  // Clear any saved credentials to ensure fresh login each time
  const savedUser = getSavedUser();
  if (savedUser) {
    console.log('[Router] Clearing saved credentials');
    clearSavedUser();
  }

  // Always show login screen if not logged in
  updateScreen();
}

/**
 * Navigate to a route
 * @param {string} route - Route to navigate to
 */
function navigate(route) {
  currentRoute = route;

  // Update URL without reloading
  const url = new URL(window.location);
  url.pathname = route;
  window.history.pushState({}, '', url);

  updateScreen();
}

/**
 * Navigate to chat after login
 */
function goToChat() {
  navigate(ROUTES.CHAT);
}

/**
 * Navigate to login after logout
 */
function goToLogin() {
  currentRoute = ROUTES.LOGIN;
  setJoined(false);
  setUsername('');

  // Update URL without reload
  const url = new URL(window.location);
  url.pathname = ROUTES.LOGIN;
  window.history.replaceState({}, '', url);

  updateScreen();
}

/**
 * Get current route
 * @returns {string} Current route
 */
function getCurrentRoute() {
  return currentRoute;
}

export {
  initRouter,
  navigate,
  goToChat,
  goToLogin,
  getCurrentRoute,
  ROUTES
};
