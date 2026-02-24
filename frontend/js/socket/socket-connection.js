/**
 * SOCKET CONNECTION
 * Manages Socket.IO connection
 * File: frontend/js/socket/socket-connection.js
 */

import { setSocketInstance } from './socket-events.js';

let socket = null;

/**
 * Start the Socket.IO connection
 * @returns {Object} Socket instance
 */
function initSocket() {
  socket = io({
    autoConnect: true,
    reconnection: true
  });

  console.log('[Socket] Connecting...');

  socket.on('connect', () => {
    console.log('[Socket] Connected! ID:', socket.id);

    // Notify socket-events module of connection
    if (socket.id) {
      setSocketInstance(socket);
    }
  });

  return socket;
}

/**
 * Get the socket instance
 * @returns {Object} Socket or null
 */
function getSocket() {
  return socket;
}

/**
 * Check if connected
 * @returns {boolean} True if connected
 */
function isConnected() {
  return socket?.connected || false;
}

/**
 * Disconnect from server
 */
function disconnect() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export {
  initSocket,
  getSocket,
  isConnected,
  disconnect
};
