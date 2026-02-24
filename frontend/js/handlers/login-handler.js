/**
 * LOGIN HANDLER
 * Handles user login flow
 * File: frontend/js/handlers/login-handler.js
 */

import { getUsername, setUsername, setJoined, setSocketId } from '../state.js';
import { saveUser } from '../ui/login.js';
import { joinChat, joinRoom } from '../socket-client.js';
import { goToChat } from '../router.js';
import { updateMobileUsername } from '../ui/mobile-nav.js';
import { updateChatHeader } from '../ui/sidebar.js';
import { updateInputPlaceholder, updateRoomBackground } from '../ui/chat.js';

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
 * @param {string} username - Username
 */
function handleUserJoin(username) {
  console.log('[App] User joined:', username);

  // Update state
  setUsername(username);
  setJoined(true);

  // Update UI with username
  const displayUsername = document.getElementById('display-username');
  if (displayUsername) {
    displayUsername.textContent = username;
  }

  // Update mobile header username
  updateMobileUsername();

  // Join the default room
  joinRoom('general');

  // Update UI
  updateChatHeader('general', null);
  updateInputPlaceholder('general', null);
  const container = document.getElementById('messages-container');
  updateRoomBackground(container, 'general');

  // Navigate to chat route
  goToChat();
}

export {
  handleLoginAttempt,
  handleUserJoin
};
