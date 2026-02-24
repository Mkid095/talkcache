/**
 * NAVIGATION HANDLER
 * Handles room and user selection
 * File: frontend/js/handlers/navigation-handler.js
 */

import {
  getCurrentRoom,
  getSocketId,
  setPrivateRecipient,
  setCurrentRoom,
  getUsers,
  isInPrivateChat
} from '../state.js';

import {
  joinRoom
} from '../socket-client.js';

import {
  updateChatHeader,
  updateActiveRoom
} from '../ui/sidebar.js';

import {
  renderModalRooms,
  renderModalUsers
} from '../ui/mobile-nav.js';

import {
  updateInputPlaceholder,
  updateRoomBackground,
  renderMessages
} from '../ui/chat.js';

/**
 * Handle room selection
 * @param {string} room - Room name
 */
function handleRoomSelect(room) {
  console.log('Room selected:', room);

  // End private chat if active
  if (isInPrivateChat()) {
    setPrivateRecipient(null);
  }

  // Update state
  setCurrentRoom(room);

  // Join room via socket
  joinRoom(room);

  // Update UI
  renderMessages();
  updateChatHeader(room, null);
  updateInputPlaceholder(room, null);
  const container = document.getElementById('messages-container');
  updateRoomBackground(container, room);
  updateActiveRoom(room);
  renderModalRooms();
}

/**
 * Handle user selection (private chat)
 * @param {string} userId - User's socket ID
 */
function handleUserSelect(userId) {
  console.log('User selected for private chat:', userId);

  // Don't chat with yourself
  if (userId === getSocketId()) {
    return;
  }

  // Find the user from state
  const users = getUsers();
  const selectedUser = users.find(u => u.id === userId);

  if (!selectedUser) {
    console.log('[App] User not found:', userId);
    return;
  }

  console.log('[App] Starting private chat with:', selectedUser.name);

  // Update state
  setPrivateRecipient(selectedUser);

  // Update UI
  renderMessages();
  updateChatHeader(null, selectedUser);
  updateInputPlaceholder(null, selectedUser);
  const container = document.getElementById('messages-container');
  updateRoomBackground(container, '', selectedUser);
  updateActiveRoom('');
  renderModalUsers();
}

export {
  handleRoomSelect,
  handleUserSelect
};
