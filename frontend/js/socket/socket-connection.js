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
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: Infinity
  });

  console.log('[Socket] Connecting...');

  socket.on('connect', () => {
    console.log('[Socket] Connected! ID:', socket.id);
    setSocketInstance(socket);
  });

  socket.on('disconnect', () => {
    console.log('[Socket] Disconnected');
  });

  socket.on('reconnect', (attemptNumber) => {
    console.log('[Socket] Reconnected! ID:', socket.id, 'Attempt:', attemptNumber);
    setSocketInstance(socket);
  });

  socket.on('reconnect_attempt', (attemptNumber) => {
    console.log('[Socket] Reconnecting... Attempt:', attemptNumber);
  });

  socket.on('reconnect_failed', () => {
    console.error('[Socket] Reconnection failed');
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
 * Ensure socket is connected, reconnect if needed
 * @returns {Object} Socket instance
 */
function ensureConnected() {
  if (!socket) {
    console.log('[Socket] Creating new socket connection');
    return initSocket();
  }

  if (!socket.connected) {
    console.log('[Socket] Reconnecting socket...');
    // Ensure reconnection is enabled (in case it was disabled after logout)
    socket.io.opts.reconnection = true;
    socket.connect();
  }

  return socket;
}

/**
 * Disconnect from server and clear socket
 */
function disconnect() {
  if (socket) {
    // Disconnect and prevent auto-reconnect
    socket.disconnect();
    socket.io.opts.reconnection = false;
    socket = null;
  }
  setSocketInstance(null);
}

export {
  initSocket,
  getSocket,
  isConnected,
  ensureConnected,
  disconnect
};
