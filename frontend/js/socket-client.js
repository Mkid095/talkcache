/**
 * SOCKET.IO CLIENT
 * Main module that exports all socket functionality
 * File: frontend/js/socket-client.js
 */

import {
  initSocket,
  getSocket,
  isConnected,
  disconnect
} from './socket/socket-connection.js';

import {
  setupChatHandlers,
  getSocketInstance
} from './socket/socket-events.js';

import {
  joinChat,
  joinRoom,
  sendMessage,
  sendPrivateMessage,
  createRoom
} from './socket/socket-api.js';

// Export all functions from submodules
export {
  initSocket,
  getSocket,
  isConnected,
  disconnect,
  setupChatHandlers,
  joinChat,
  joinRoom,
  sendMessage,
  sendPrivateMessage,
  createRoom
};
