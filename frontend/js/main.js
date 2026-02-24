/**
 * MAIN.JS
 * Application entry point
 * File: frontend/js/main.js
 */

import { initSocket, setupChatHandlers, disconnect, createRoom } from './socket-client.js';
import { initRouter, goToLogin } from './router.js';
import { clearSavedUser } from './ui/login.js';
import { handleLoginAttempt } from './handlers/login-handler.js';
import { initializeUI } from './app-ui.js';
import { setupSocketHandlers } from './app-socket-handlers.js';
import { renderMessages } from './ui/chat.js';
import { resetState } from './state.js';

// App state
let socket = null;

// =============================================
// APP INITIALIZATION
// =============================================

/**
 * Start the application
 */
function initApp() {
  console.log('Starting Talk Cache...');

  // Connect to server
  socket = initSocket();

  // Initialize router (no auto-login)
  initRouter();

  // Set up the UI
  initializeUI(handleCreateRoom, handleLogout);

  // Set up socket event handlers
  setupSocketHandlers(setupChatHandlers, goToLogin);

  console.log('App ready!');
}

// =============================================
// LOGOUT
// =============================================

/**
 * Handle user logout
 */
function handleLogout() {
  console.log('[App] Logging out...');

  // Reset all state to initial values
  resetState();

  // Clear saved credentials
  clearSavedUser();

  // Disconnect from server
  disconnect();

  // Navigate to login route
  goToLogin();
}

// =============================================
// ROOM CREATION
// =============================================

/**
 * Handle creating a new room
 * @param {string} roomName - New room name
 */
function handleCreateRoom(roomName) {
  console.log('Creating room:', roomName);

  // Send to server to persist
  createRoom(roomName);

  // Note: We don't update UI here - we wait for the server
  // to send back the rooms_list event
}

// =============================================
// START THE APP
// =============================================

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  disconnect();
});
