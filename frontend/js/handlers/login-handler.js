/**
 * LOGIN HANDLER
 * Handles user login flow
 * File: frontend/js/handlers/login-handler.js
 */

import { getUsername, setUsername, setJoined, setSocketId, getSocketId } from '../state.js';
import { saveUser } from '../ui/login.js';
import { joinChat } from '../socket-client.js';
import { goToChat } from '../router.js';
import { updateMobileUsername } from '../ui/mobile/mobile-nav.js';
import { handleRoomSelect } from './navigation-handler.js';

/**
 * Handle login attempt with credentials
 * @param {Object} credentials - Username and password
 */
function handleLoginAttempt(credentials) {
  console.log('[App] Login attempt:', credentials.username);

  // Send credentials to server for verification
  joinChat(credentials);
}

/**
 * Handle user joining the chat (after successful login)
 * @param {Object} data - Login data containing username, userId, color
 */
function handleUserJoin(data) {
  console.log('[App] User joined:', data);

  // Update state
  setUsername(data.username);
  setSocketId(data.userId);
  setJoined(true);

  // Update UI with username
  const displayUsername = document.getElementById('display-username');
  if (displayUsername) {
    displayUsername.textContent = data.username;
  }

  // Update mobile header username
  updateMobileUsername();

  // Join the default "general" room
  handleRoomSelect('general');
  console.log('[App] Auto-joining default room: general');

  // Navigate to chat route
  goToChat();
}

export {
  handleLoginAttempt,
  handleUserJoin
};
