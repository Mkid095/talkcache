/**
 * STATE MANAGEMENT
 * Stores all the application data in one place
 */

// =============================================
// APPLICATION STATE
// All the data our app needs to remember
// =============================================

const state = {
  // User information
  username: '',
  socketId: null,
  isJoined: false,

  // Current view
  currentRoom: 'general',
  privateRecipient: null,  // Who we're chatting with privately

  // Data from server
  messages: [],
  users: [],
  rooms: ['general']
};

// =============================================
// GETTER FUNCTIONS - Read data from state
// =============================================

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

/**
 * Get messages for current view (room or private chat)
 * @returns {Array} Filtered messages
 */
function getFilteredMessages() {
  if (state.privateRecipient) {
    // Show only private messages between me and the other person
    return state.messages.filter(msg => {
      return msg.isPrivate && (
        (msg.senderId === state.socketId && msg.recipientId === state.privateRecipient.id) ||
        (msg.senderId === state.privateRecipient.id && msg.recipientId === state.socketId)
      );
    });
  } else {
    // Show only public messages for current room
    return state.messages.filter(msg => {
      return !msg.isPrivate && msg.room === state.currentRoom;
    });
  }
}

// =============================================
// SETTER FUNCTIONS - Update state
// =============================================

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
  // Update rooms list from messages
  const uniqueRooms = new Set(['general']);
  messages.forEach(msg => {
    if (!msg.isPrivate && msg.room) {
      uniqueRooms.add(msg.room);
    }
  });
  state.rooms = Array.from(uniqueRooms);
}

function addMessage(message) {
  state.messages.push(message);
  // Add new room if needed
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

// =============================================
// UTILITY FUNCTIONS
// =============================================

/**
 * Check if a user is the current user
 * @param {Object|string} user - User object or socket ID
 * @returns {boolean} True if this is me
 */
function isMe(user) {
  const userId = typeof user === 'string' ? user : user?.id;
  return userId === state.socketId;
}

/**
 * Check if a room exists
 * @param {string} room - Room name
 * @returns {boolean} True if room exists
 */
function roomExists(room) {
  return state.rooms.includes(room);
}

// Export all functions
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
  roomExists
};
