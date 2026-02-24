/**
 * APP UI INITIALIZATION
 * Handles initialization of all UI components
 * File: frontend/js/app-ui.js
 */

import { initLogin } from './ui/login.js';
import { initSidebar } from './ui/sidebar.js';
import { initChat } from './ui/chat.js';
import { initMobileNav } from './ui/mobile/mobile-nav.js';
import { handleLoginAttempt } from './handlers/login-handler.js';
import { handleRoomSelect, handleUserSelect } from './handlers/navigation-handler.js';
import { handleSendMessage } from './handlers/message-handler.js';

/**
 * Set up all UI components
 * @param {Function} handleCreateRoom - Room creation handler
 * @param {Function} handleLogout - Logout handler
 * @returns {Object} Logout handler function
 */
export function initializeUI(handleCreateRoom, handleLogout) {
  // Login screen
  initLogin((credentials) => {
    handleLoginAttempt(credentials);
  });

  // Sidebar
  initSidebar({
    onRoomSelect: (room) => handleRoomSelect(room),
    onUserSelect: (userId) => handleUserSelect(userId),
    onCreateRoom: handleCreateRoom
  });

  // Chat area
  initChat({
    onSendMessage: (messageText) => handleSendMessage(messageText)
  });

  // Mobile navigation
  initMobileNav({
    onRoomSelect: (room) => handleRoomSelect(room),
    onUserSelect: (userId) => handleUserSelect(userId),
    onCreateRoom: handleCreateRoom,
    onLogout: handleLogout
  });

  // Setup logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
}
