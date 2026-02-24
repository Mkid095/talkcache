/**
 * APP SOCKET EVENT HANDLERS
 * Handles all Socket.IO event callbacks for the main app
 * File: frontend/js/app-socket-handlers.js
 */

import {
  getUsername,
  getSocketId,
  setMessages,
  setUsers,
  setRooms,
  addMessage,
  getPrivateRecipient,
  getCurrentRoom,
  incrementUnread,
  incrementRoomUnread,
  setCurrentRoom
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
      console.log('[App] Loading', messages.length, 'messages from history');

      setMessages(messages);

      // If no current room is set, default to "general"
      const currentRoom = getCurrentRoom();
      if (!currentRoom) {
        console.log('[App] No current room set, defaulting to "general"');
        setCurrentRoom('general');
      }

      renderRooms();
      renderModalRooms();
      renderMessages();
    },

    // New message received
    onReceiveMessage: (message) => {
      addMessage(message);

      const privateRecipient = getPrivateRecipient();
      const currentRoom = getCurrentRoom();
      const mySocketId = getSocketId();

      // Debug logging for private messages
      if (message.isPrivate) {
        console.log('[App] Private message received:', {
          senderId: message.senderId,
          recipientId: message.recipientId,
          mySocketId: mySocketId,
          currentRecipient: privateRecipient?.id,
          text: message.text
        });
      }

      // Display if: room message matches current room, OR
      // private message is from/to the current private chat recipient
      const shouldDisplay = message.isPrivate
        ? (privateRecipient && (
            privateRecipient.id === message.senderId ||   // Message from recipient
            privateRecipient.id === message.recipientId   // Message to recipient (sent by me)
          ))
        : (message.room === currentRoom);

      console.log('[App] Should display message?', shouldDisplay);

      if (shouldDisplay) {
        addMessageToChat(message);
      }

      // Track unread private messages (only for messages FROM others, not sent by me)
      if (message.isPrivate && message.senderId !== getSocketId()) {
        if (!privateRecipient || privateRecipient.id !== message.senderId) {
          incrementUnread(message.senderId);
          renderUsers();
          renderModalUsers();
          updateUsersBadge();
        }
      }

      // Track unread room messages (only for messages FROM others, not sent by me)
      if (!message.isPrivate && message.room && message.senderId !== getSocketId()) {
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

      // Ensure "general" room is always in the list (default room)
      let updatedRooms = [...rooms];
      if (!updatedRooms.includes('general')) {
        updatedRooms.push('general');
        console.log('[App] Added default "general" room');
      }

      setRooms(updatedRooms);
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
