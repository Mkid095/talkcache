/**
 * LOGIN HANDLER
 * Handles user login flow
 * File: frontend/js/handlers/login-handler.js
 */

import { getUsername, setUsername, setJoined, setSocketId, getSocketId, setCurrentRoom, getCurrentRoom, addRoom } from '../state.js';
import { joinChat, joinRoom } from '../socket-client.js';
import { goToChat } from '../router.js';
import { updateMobileUsername } from '../ui/mobile/mobile-nav.js';

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

  // Navigate to chat route FIRST
  goToChat();

  // Set current room to general and add to state
  const currentRoom = getCurrentRoom();
  if (!currentRoom) {
    console.log('[App] Setting default room: general');
    setCurrentRoom('general');
    addRoom('general');
  }

  // Join the general room via socket
  joinRoom('general');
}

export {
  handleLoginAttempt,
  handleUserJoin
};

// Import renderMessages at the bottom to avoid circular dependency
import { renderMessages } from '../ui/chat.js';
