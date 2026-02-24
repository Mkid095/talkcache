/**
 * STATE MANAGEMENT - CORE
 * Stores all the application data in one place
 * File: frontend/js/state.js
 */

import { clearAllUnread } from './state-unread.js';

const state = {
  username: '',
  socketId: null,
  isJoined: false,
  currentRoom: null,
  privateRecipient: null,
  messages: [],
  users: [],
  rooms: []
};

// Getters
function getUsername() {
  return state.username;
}

function getSocketId() {
  return state.socketId;
}

function hasJoined() {
  return state.isJoined;
}

function getCurrentRoom() {
  return state.currentRoom;
}

function getPrivateRecipient() {
  return state.privateRecipient;
}

function getMessages() {
  return state.messages;
}

function getUsers() {
  return state.users;
}

function getRooms() {
  return state.rooms;
}

function isInPrivateChat() {
  return state.privateRecipient !== null;
}

function getFilteredMessages() {
  if (state.privateRecipient) {
    return state.messages.filter(msg => {
      if (!msg.isPrivate) return false;
      // Match messages between me and the recipient using usernames
      const iSentIt = msg.senderName === state.username;
      const theySentIt = msg.senderName === state.privateRecipient.name;

      // Show if I sent it OR they sent it
      return iSentIt || theySentIt;
    });
  }
  return state.messages.filter(msg => {
    return !msg.isPrivate && msg.room === state.currentRoom;
  });
}

// Setters
function setUsername(username) {
  state.username = username;
}

function setSocketId(socketId) {
  state.socketId = socketId;
}

function setJoined(joined) {
  state.isJoined = joined;
}

function setCurrentRoom(room) {
  state.currentRoom = room;
}

function setPrivateRecipient(recipient) {
  state.privateRecipient = recipient;
  if (recipient) {
    state.currentRoom = 'private';
  }
}

function setMessages(messages) {
  state.messages = messages;
  // Add rooms from messages to existing rooms, don't replace
  const uniqueRooms = new Set(state.rooms);
  messages.forEach(msg => {
    if (!msg.isPrivate && msg.room) {
      uniqueRooms.add(msg.room);
    }
  });
  state.rooms = Array.from(uniqueRooms);
}

function addMessage(message) {
  state.messages.push(message);
  if (!message.isPrivate && message.room && !state.rooms.includes(message.room)) {
    state.rooms.push(message.room);
  }
}

function setUsers(users) {
  state.users = users;
}

function setRooms(rooms) {
  state.rooms = rooms;
}

function addRoom(room) {
  if (!state.rooms.includes(room)) {
    state.rooms.push(room);
  }
}

// Utility functions
function isMe(user) {
  const userId = typeof user === 'string' ? user : user?.id;
  return userId === state.socketId;
}

function roomExists(room) {
  return state.rooms.includes(room);
}

/**
 * Reset all state to initial values (for logout)
 */
function resetState() {
  state.username = '';
  state.socketId = null;
  state.isJoined = false;
  state.currentRoom = null;
  state.privateRecipient = null;
  state.messages = [];
  state.users = [];
  state.rooms = [];
  clearAllUnread();
}

// Re-export unread functions for backward compatibility
export {
  getUnreadCount,
  getAllUnreadCounts,
  getTotalUnreadCount,
  incrementUnread,
  clearUnread,
  getRoomUnread,
  incrementRoomUnread,
  setRoomUnread,
  clearRoomUnread,
  getTotalRoomUnread,
  clearAllUnread
} from './state-unread.js';

// Export core functions
export {
  getUsername,
  getSocketId,
  hasJoined,
  getCurrentRoom,
  getPrivateRecipient,
  getMessages,
  getUsers,
  getRooms,
  isInPrivateChat,
  getFilteredMessages,
  setUsername,
  setSocketId,
  setJoined,
  setCurrentRoom,
  setPrivateRecipient,
  setMessages,
  addMessage,
  setUsers,
  setRooms,
  addRoom,
  isMe,
  roomExists,
  resetState
};
