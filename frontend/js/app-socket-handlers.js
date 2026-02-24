/**
 * APP SOCKET EVENT HANDLERS
 * Handles all Socket.IO event callbacks for the main app
 * File: frontend/js/app-socket-handlers.js
 */

import {
  getUsername,
  setMessages,
  setUsers,
  setRooms,
  addMessage,
  getPrivateRecipient,
  getCurrentRoom,
  incrementUnread,
  incrementRoomUnread
} from './state.js';

import {
  renderRooms,
  renderUsers,
  addRoomToList
} from './ui/sidebar.js';

import {
  addMessage as addMessageToChat,
  renderMessages
} from './ui/chat.js';

import {
  renderModalRooms,
  renderModalUsers,
  updateUsersBadge
} from './ui/mobile/mobile-nav.js';

import {
  saveUser
} from './ui/login.js';

import {
  handleUserJoin
} from './handlers/login-handler.js';

import {
  showError,
  showWarning
} from './utils/toast.js';

/**
 * Set up handlers for server events
 * @param {Object} setupChatHandlers - Socket handler setup function
 * @param {Function} goToLogin - Navigate to login function
 * @returns {Function} Logout handler
 */
export function setupSocketHandlers(setupChatHandlers, goToLogin) {
  setupChatHandlers({
    // Login successful
    onLoginSuccess: (data) => {
      console.log('[App] Login successful:', data);
      handleUserJoin(data);
      saveUser(data.username);
    },

    // Login failed
    onLoginError: (error) => {
      console.error('[App] Login failed:', error);

      let errorMessage = 'Login failed. Please try again.';

      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && error.message) {
        errorMessage = error.message;
      }

      showError(errorMessage);
    },

    // Users list updated
    onUsersList: (users) => {
      setUsers(users);
      renderUsers();
      renderModalUsers();
    },

    // Message history loaded
    onMessageHistory: (messages) => {
      setMessages(messages);
      renderRooms();
      renderModalRooms();
      renderMessages();
    },

    // New message received
    onReceiveMessage: (message) => {
      addMessage(message);

      const privateRecipient = getPrivateRecipient();
      const currentRoom = getCurrentRoom();
      const shouldDisplay = message.isPrivate
        ? (privateRecipient && privateRecipient.id === message.senderId)
        : (message.room === currentRoom);

      if (shouldDisplay) {
        addMessageToChat(message);
      }

      // Track unread private messages
      if (message.isPrivate && message.senderId !== getUsername()) {
        if (!privateRecipient || privateRecipient.id !== message.senderId) {
          incrementUnread(message.senderId);
          renderUsers();
          renderModalUsers();
          updateUsersBadge();
        }
      }

      // Track unread room messages
      if (!message.isPrivate && message.room) {
        if (currentRoom !== message.room) {
          incrementRoomUnread(message.room);
          renderRooms();
          renderModalRooms();
        }

        const rooms = document.querySelectorAll('.room-btn');
        const roomExists = Array.from(rooms).some(btn => btn.dataset.room === message.room);
        if (!roomExists) {
          addRoomToList(message.room);
        }
      }
    },

    // Rooms list updated
    onRoomsList: (rooms) => {
      console.log('[App] Rooms list updated:', rooms);
      setRooms(rooms);
      renderRooms();
      renderModalRooms();
    },

    // Room creation error
    onRoomError: (error) => {
      console.error('[App] Room error:', error);

      let errorMessage = 'Failed to create room. Please try again.';

      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && error.message) {
        errorMessage = error.message;
      }

      showWarning(errorMessage);
    }
  });
}
