/**
 * SOCKET API
 * Functions for sending events to server
 * File: frontend/js/socket/socket-api.js
 */

import { emit } from './socket-events.js';

/**
 * Join the chat with credentials
 * @param {Object} credentials - Username and password
 */
function joinChat(credentials) {
  emit('join', credentials);
}

/**
 * Join a room
 * @param {string} room - Room name
 */
function joinRoom(room) {
  emit('join_room', room);
}

/**
 * Send a message to a room
 * @param {string} room - Room name
 * @param {string} text - Message text
 */
function sendMessage(room, text) {
  emit('send_message', { room, text });
}

/**
 * Send a private message
 * @param {string} recipientId - Recipient's socket ID
 * @param {string} text - Message text
 */
function sendPrivateMessage(recipientId, text) {
  emit('send_private_message', { recipientId, text });
}

/**
 * Create a new room
 * @param {string} roomName - Room name to create
 */
function createRoom(roomName) {
  emit('create_room', roomName);
}

export {
  joinChat,
  joinRoom,
  sendMessage,
  sendPrivateMessage,
  createRoom
};
