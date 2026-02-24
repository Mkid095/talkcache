/**
 * SOCKET EVENTS
 * Handles setting up and managing socket event listeners
 * File: frontend/js/socket/socket-events.js
 */

let socket = null;
let pendingHandlers = null;

/**
 * Set socket instance (called by socket-connection)
 */
function setSocketInstance(socketInstance) {
  socket = socketInstance;

  // If there are pending handlers, set them up now
  if (pendingHandlers) {
    console.log('[Socket] Setting up pending handlers');
    setupChatHandlers(pendingHandlers);
    pendingHandlers = null;
  }
}

/**
 * Get socket instance
 */
function getSocketInstance() {
  return socket;
}

/**
 * Emit an event to the server
 * @param {string} eventName - Name of the event
 * @param {any} data - Data to send
 */
function emit(eventName, data) {
  if (!socket) {
    console.warn('[Socket] Not initialized');
    return;
  }
  if (!socket.connected) {
    console.warn('[Socket] Not connected');
    return;
  }
  socket.emit(eventName, data);
  console.log(`[Socket] Sent: ${eventName}`, data);
}

/**
 * Set up all the event listeners for chat
 * @param {Object} handlers - Callback functions
 */
function setupChatHandlers(handlers) {
  if (!socket) {
    // Store handlers for when socket connects
    console.log('[Socket] Deferring handler setup until socket connects');
    pendingHandlers = handlers;
    return;
  }

  console.log('[Socket] Setting up event handlers');

  // Login successful
  socket.on('login_success', (data) => {
    console.log('[Socket] Login success:', data);
    if (handlers.onLoginSuccess) handlers.onLoginSuccess(data);
  });

  // Login failed
  socket.on('login_error', (error) => {
    console.error('[Socket] Login error:', error);
    if (handlers.onLoginError) handlers.onLoginError(error);
  });

  // Users list updated
  socket.on('users_list', (users) => {
    console.log('[Socket] Users list:', users.length);
    if (handlers.onUsersList) handlers.onUsersList(users);
  });

  // Message history loaded
  socket.on('message_history', (messages) => {
    console.log('[Socket] History:', messages.length);
    if (handlers.onMessageHistory) handlers.onMessageHistory(messages);
  });

  // New message received
  socket.on('receive_message', (message) => {
    console.log('[Socket] New message');
    if (handlers.onReceiveMessage) handlers.onReceiveMessage(message);
  });

  // Rooms list updated
  socket.on('rooms_list', (rooms) => {
    console.log('[Socket] Rooms list:', rooms.length);
    if (handlers.onRoomsList) handlers.onRoomsList(rooms);
  });

  // Room creation error
  socket.on('room_error', (error) => {
    console.error('[Socket] Room error:', error);
    if (handlers.onRoomError) handlers.onRoomError(error);
  });
}

export {
  setSocketInstance,
  getSocketInstance,
  emit,
  setupChatHandlers
};
