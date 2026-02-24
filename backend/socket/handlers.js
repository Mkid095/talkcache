/**
 * SOCKET EVENT HANDLERS
 * Functions that handle client socket events
 */

const { loadMessages, saveMessage, verifyUser, registerOrUpdateUser, findUser, loadRooms, addRoom } = require("../data/store");

// Store connected users
const connectedUsers = new Map();

// Color palette for users - different colors to tell users apart
const USER_COLORS = [
  '#e74c3c', // Red
  '#9b59b6', // Purple
  '#3498db', // Blue
  '#1abc9c', // Teal
  '#f39c12', // Orange
  '#e67e22', // Carrot
  '#16a085', // Green sea
  '#27ae60', // Emerald
  '#2980b9', // Belize blue
  '#8e44ad', // Wisteria
  '#2c3e50', // Midnight blue
  '#f1c40f', // Yellow
  '#e67e22', // Pumpkin
  '#d35400', // Dark orange
  '#c0392b'  // Dark red
];

/**
 * Get or assign a random color for a user
 * @param {string} username - Username
 * @returns {string} Hex color code
 */
function getUserColor(username) {
  // Generate a consistent color based on username
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % USER_COLORS.length;
  return USER_COLORS[index];
}

// =============================================
// HELPER FUNCTIONS
// =============================================

/**
 * Generate a unique message ID
 */
function generateMessageId() {
  return Date.now().toString() + Math.random().toString(36).substring(2, 11);
}

/**
 * Create a message object
 */
function createMessage(user, text, room, isPrivate = false, recipientId = null) {
  return {
    id: generateMessageId(),
    room: room,
    senderId: user.id,
    senderName: user.name,
    senderColor: user.color,
    text: text,
    timestamp: Date.now(),
    isPrivate: isPrivate,
    recipientId: recipientId
  };
}

// =============================================
// SOCKET EVENT HANDLERS
// =============================================

/**
 * Handle user joining with username and password verification
 * Auto-registers new users if they don't exist
 * Assigns a random color to each user and saves to JSON
 * @param {Socket} socket - User's socket
 * @param {Server} io - Socket.IO server
 * @param {Object} credentials - Username and password
 */
async function handleJoin(socket, io, credentials) {
  // Validate input
  if (!credentials || typeof credentials !== 'object') {
    socket.emit("login_error", {
      code: "INVALID_INPUT",
      message: "Please provide both username and password"
    });
    return;
  }

  const username = credentials.username?.trim();
  const password = credentials.password?.trim();

  if (!username || !password) {
    socket.emit("login_error", {
      code: "MISSING_FIELDS",
      message: "Please provide both username and password"
    });
    return;
  }

  if (username.length > 50 || password.length > 50) {
    socket.emit("login_error", {
      code: "INVALID_LENGTH",
      message: "Username and password must be 50 characters or less"
    });
    return;
  }

  // Check if user exists
  const existingUser = await findUser(username);

  if (existingUser) {
    // User exists - verify password
    const isValid = await verifyUser(username, password);
    if (!isValid) {
      // User exists but wrong password
      socket.emit("login_error", {
        code: "WRONG_PASSWORD",
        message: `A user with username "${username}" already exists. You may have entered the wrong password. Please try again or use a different username.`
      });
      console.log(`Failed login attempt for: ${username} (wrong password)`);
      return;
    }
    // Update last login time (preserve existing color)
    await registerOrUpdateUser(username, password, existingUser.color);
  } else {
    // New user - assign color and register
    const userColor = getUserColor(username);
    await registerOrUpdateUser(username, password, userColor);
    console.log(`New user registered: ${username} with color ${userColor}`);
  }

  // Get user data (with color from JSON)
  const userData = await findUser(username);
  const userColor = userData.color || getUserColor(username);

  // Save connected user with color from JSON
  const user = { id: socket.id, name: username, color: userColor };
  connectedUsers.set(socket.id, user);
  console.log(`User joined: ${username} with color ${userColor}`);

  // Send success response with color
  socket.emit("login_success", { username, userId: socket.id, color: userColor });

  // Send updated users list to everyone (includes colors)
  io.emit("users_list", Array.from(connectedUsers.values()));

  // Send rooms list to everyone
  const rooms = await loadRooms();
  io.emit("rooms_list", rooms);

  // Send message history to new user
  const history = await loadMessages();
  socket.emit("message_history", history);
}

/**
 * Handle joining a room
 * @param {Socket} socket - User's socket
 * @param {string} room - Room name
 */
function handleJoinRoom(socket, room) {
  // Validate room name
  if (!room || typeof room !== 'string') return;
  const cleanRoom = room.trim();
  if (!cleanRoom || cleanRoom.length > 50) return;

  // Leave other rooms
  socket.rooms.forEach((r) => {
    if (r !== socket.id) {
      socket.leave(r);
    }
  });

  // Join new room
  socket.join(cleanRoom);
  console.log(`User ${socket.id} joined room: ${cleanRoom}`);
}

/**
 * Handle sending a room message
 * @param {Socket} socket - User's socket
 * @param {Server} io - Socket.IO server
 * @param {Object} data - Message data
 */
async function handleSendMessage(socket, io, data) {
  // Validate input
  if (!data || typeof data !== 'object') return;

  const cleanRoom = (data.room || 'general').trim().substring(0, 50) || 'general';
  const cleanText = (data.text || '').trim();

  const user = connectedUsers.get(socket.id);
  if (!user || !cleanText || cleanText.length > 1000) return;

  // Create message
  const message = createMessage(user, cleanText, cleanRoom, false);

  // Save to file
  await saveMessage(message);

  // Send to room
  io.to(message.room).emit("receive_message", message);
  console.log(`Message in ${message.room} from ${user.name}`);
}

/**
 * Handle sending a private message
 * @param {Socket} socket - User's socket
 * @param {Server} io - Socket.IO server
 * @param {Object} data - Message data
 */
async function handlePrivateMessage(socket, io, data) {
  // Validate input
  if (!data || typeof data !== 'object') return;

  const cleanRecipientId = data.recipientId?.trim() || '';
  const cleanText = (data.text || '').trim();

  const user = connectedUsers.get(socket.id);
  if (!user || !cleanText || cleanText.length > 1000 || !cleanRecipientId) return;

  // Create message
  const message = createMessage(user, cleanText, "private", true, cleanRecipientId);

  // Save to file
  await saveMessage(message);

  // Send to both people
  io.to(cleanRecipientId).emit("receive_message", message);
  socket.emit("receive_message", message);
  console.log(`Private message from ${user.name}`);
}

/**
 * Handle user disconnecting
 * @param {Socket} socket - User's socket
 * @param {Server} io - Socket.IO server
 */
function handleDisconnect(socket, io) {
  const user = connectedUsers.get(socket.id);
  if (user) {
    console.log(`User disconnected: ${user.name}`);
    connectedUsers.delete(socket.id);
    io.emit("users_list", Array.from(connectedUsers.values()));
  }
}

/**
 * Send users list to a socket
 * @param {Socket} socket - Socket to send to
 */
function sendUsersList(socket) {
  socket.emit("users_list", Array.from(connectedUsers.values()));
}

/**
 * Handle creating a new room
 * @param {Socket} socket - User's socket
 * @param {Server} io - Socket.IO server
 * @param {string} roomName - Room name to create
 */
async function handleCreateRoom(socket, io, roomName) {
  // Validate room name
  const cleanRoom = roomName?.trim();
  if (!cleanRoom || cleanRoom.length > 50) {
    socket.emit("room_error", "Invalid room name");
    return;
  }

  // Add room to storage
  await addRoom(cleanRoom);

  // Send updated rooms list to everyone
  const rooms = await loadRooms();
  io.emit("rooms_list", rooms);

  console.log(`Room created: ${cleanRoom}`);
}

// Export all handlers
module.exports = {
  handleJoin,
  handleJoinRoom,
  handleSendMessage,
  handlePrivateMessage,
  handleDisconnect,
  sendUsersList,
  handleCreateRoom
};
