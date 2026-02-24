/**
 * MAIN.JS
 * Application entry point
 * File: frontend/js/main.js
 */

// Import state functions
import {
  getUsername,
  setSocketId,
  setMessages,
  setUsers,
  setRooms,
  addMessage,
  getUsers,
  getMessages
} from './state.js';

// Import socket client
import {
  initSocket,
  setupChatHandlers,
  disconnect,
  createRoom
} from './socket-client.js';

// Import login UI
import {
  initLogin,
  saveUser,
  clearSavedUser
} from './ui/login.js';

// Import sidebar
import {
  initSidebar,
  renderRooms,
  renderUsers,
  addRoomToList,
  updateChatHeader
} from './ui/sidebar.js';

// Import chat
import {
  initChat,
  renderMessages,
  addMessage as addMessageToChat,
  updateInputPlaceholder,
  updateRoomBackground
} from './ui/chat.js';

// Import mobile navigation
import {
  initMobileNav,
  renderModalRooms,
  renderModalUsers,
  updateMobileUsername
} from './ui/mobile-nav.js';

// Import router
import {
  initRouter,
  goToChat,
  goToLogin
} from './router.js';

// Import toast notifications
import {
  showError,
  showWarning
} from './utils/toast.js';

// Import handlers
import {
  handleLoginAttempt,
  handleUserJoin
} from './handlers/login-handler.js';

import {
  handleRoomSelect,
  handleUserSelect
} from './handlers/navigation-handler.js';

import {
  handleSendMessage
} from './handlers/message-handler.js';

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

  // Initialize router
  initRouter({
    onAutoLogin: (credentials) => {
      console.log('[Router] Auto-login for:', credentials.username);
      handleLoginAttempt(credentials);
    }
  });

  // Set up the UI
  initializeUI();

  // Set up socket event handlers
  setupSocketHandlers();

  console.log('App ready!');
}

/**
 * Set up all UI components
 */
function initializeUI() {
  // Login screen
  initLogin((credentials) => {
    handleLoginAttempt(credentials);
  });

  // Sidebar
  initSidebar({
    onRoomSelect: (room) => handleRoomSelect(room),
    onUserSelect: (userId) => handleUserSelect(userId),
    onCreateRoom: (roomName) => handleCreateRoom(roomName)
  });

  // Chat area
  initChat({
    onSendMessage: (messageText) => handleSendMessage(messageText)
  });

  // Mobile navigation
  initMobileNav({
    onRoomSelect: (room) => handleRoomSelect(room),
    onUserSelect: (userId) => handleUserSelect(userId),
    onCreateRoom: (roomName) => handleCreateRoom(roomName),
    onLogout: handleLogout
  });

  // Setup logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
}

/**
 * Handle user logout
 */
function handleLogout() {
  console.log('[App] Logging out...');

  // Clear saved credentials
  clearSavedUser();

  // Disconnect from server
  disconnect();

  // Navigate to login route
  goToLogin();
}

// =============================================
// SOCKET EVENT HANDLERS
// =============================================

/**
 * Set up handlers for server events
 */
function setupSocketHandlers() {
  setupChatHandlers({
    // Login successful
    onLoginSuccess: (data) => {
      console.log('[App] Login successful:', data);
      handleUserJoin(data.username);

      // Save to localStorage
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
      addMessage(message);  // Add to state
      addMessageToChat(message);  // Add to DOM

      // If new room, add to list
      if (!message.isPrivate && message.room) {
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
