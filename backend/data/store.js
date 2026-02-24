/**
 * DATA STORE
 * Saves and loads messages and users from JSON files
 */

const fs = require("fs/promises");
const path = require("path");

// Path to messages file
const MESSAGES_FILE = path.join(__dirname, "..", "data", "messages.json");

// Path to users file
const USERS_FILE = path.join(__dirname, "..", "data", "users.json");

// Path to rooms file
const ROOMS_FILE = path.join(__dirname, "..", "data", "rooms.json");

/**
 * SIMPLE ENCRYPTION FOR PASSWORDS
 * This is a basic encryption method for educational purposes.
 * We researched simple encryption techniques and implemented
 * a custom method using our school name prefix/suffix.
 *
 * Method: "Aber" + password + "deen"
 * Example: password "hello" becomes "Aberhellodeen"
 *
 * NOTE: In production, use proper encryption like bcrypt!
 */
const ENCRYPTION_PREFIX = "Aber";
const ENCRYPTION_SUFFIX = "deen";

/**
 * Encrypt a password using our simple method
 * @param {string} password - Plain text password
 * @returns {string} Encrypted password
 */
function encryptPassword(password) {
  return ENCRYPTION_PREFIX + password + ENCRYPTION_SUFFIX;
}

/**
 * Verify a password against encrypted version
 * @param {string} password - Plain text password to check
 * @param {string} encrypted - Encrypted password from database
 * @returns {boolean} True if password matches
 */
function verifyPassword(password, encrypted) {
  return encryptPassword(password) === encrypted;
}

/**
 * Create data folder and messages file if they don't exist
 */
async function initDataStore() {
  try {
    // Create data folder
    await fs.mkdir(path.join(__dirname, "..", "data"), { recursive: true });

    // Check if messages file exists
    try {
      await fs.access(MESSAGES_FILE);
    } catch {
      // File doesn't exist, create it
      await fs.writeFile(MESSAGES_FILE, JSON.stringify([], null, 2), "utf-8");
      console.log("Created messages file");
    }

    // Check if users file exists
    try {
      await fs.access(USERS_FILE);
    } catch {
      // File doesn't exist, create it
      await fs.writeFile(USERS_FILE, JSON.stringify({}, null, 2), "utf-8");
      console.log("Created users file");
    }

    // Check if rooms file exists
    try {
      await fs.access(ROOMS_FILE);
    } catch {
      // File doesn't exist, create it empty (no default room)
      await fs.writeFile(ROOMS_FILE, JSON.stringify([], null, 2), "utf-8");
      console.log("Created rooms file");
    }
  } catch (error) {
    console.error("Error initializing data store:", error);
  }
}

/**
 * Load all messages from file
 * @returns {Promise<Array>} Array of messages
 */
async function loadMessages() {
  try {
    const data = await fs.readFile(MESSAGES_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading messages:", error);
    return [];
  }
}

/**
 * Save a new message to file
 * @param {Object} message - Message to save
 */
async function saveMessage(message) {
  try {
    const messages = await loadMessages();
    messages.push(message);
    await fs.writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving message:", error);
  }
}

// =============================================
// USER STORAGE FUNCTIONS
// =============================================

/**
 * Load all users from file
 * @returns {Promise<Object>} Object mapping username to user data
 */
async function loadUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading users:", error);
    return {};
  }
}

/**
 * Find a user by username
 * @param {string} username - Username to find
 * @returns {Promise<Object|null>} User object or null if not found
 */
async function findUser(username) {
  try {
    const users = await loadUsers();
    return users[username] || null;
  } catch (error) {
    console.error("Error finding user:", error);
    return null;
  }
}

/**
 * Register a new user or update existing user
 * @param {string} username - Username
 * @param {string} password - Plain text password (will be encrypted)
 * @param {string} color - User's assigned color (optional)
 * @returns {Promise<Object>} User object
 */
async function registerOrUpdateUser(username, password, color = null) {
  try {
    const users = await loadUsers();
    const encryptedPassword = encryptPassword(password);

    // Get existing user or create new
    const existingUser = users[username];

    // Assign color if not provided and not already set
    const userColor = color || existingUser?.color || null;

    // Create or update user
    users[username] = {
      username,
      password: encryptedPassword,
      color: userColor,
      createdAt: existingUser?.createdAt || new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
    console.log(`User registered/updated: ${username}`);
    return users[username];
  } catch (error) {
    console.error("Error registering user:", error);
    return null;
  }
}

/**
 * Verify user login credentials
 * @param {string} username - Username
 * @param {string} password - Plain text password
 * @returns {Promise<boolean>} True if credentials are valid
 */
async function verifyUser(username, password) {
  try {
    const user = await findUser(username);
    if (!user) {
      return false;
    }
    return verifyPassword(password, user.password);
  } catch (error) {
    console.error("Error verifying user:", error);
    return false;
  }
}

// =============================================
// ROOM STORAGE FUNCTIONS
// =============================================

/**
 * Load all rooms from file
 * @returns {Promise<Array>} Array of room names
 */
async function loadRooms() {
  try {
    const data = await fs.readFile(ROOMS_FILE, "utf-8");
    const rooms = JSON.parse(data);
    return rooms;
  } catch (error) {
    console.error("Error loading rooms:", error);
    return [];
  }
}

/**
 * Save rooms to file
 * @param {Array} rooms - Array of room names
 */
async function saveRooms(rooms) {
  try {
    // Remove duplicates
    const uniqueRooms = [...new Set(rooms)];
    await fs.writeFile(ROOMS_FILE, JSON.stringify(uniqueRooms, null, 2), "utf-8");
    console.log("Rooms saved:", uniqueRooms);
  } catch (error) {
    console.error("Error saving rooms:", error);
  }
}

/**
 * Add a new room
 * @param {string} roomName - Room name to add
 */
async function addRoom(roomName) {
  try {
    const rooms = await loadRooms();
    if (!rooms.includes(roomName)) {
      rooms.push(roomName);
      await saveRooms(rooms);
      console.log(`Room added: ${roomName}`);
    }
    } catch (error) {
    console.error("Error adding room:", error);
  }
}

// Export functions
module.exports = {
  initDataStore,
  loadMessages,
  saveMessage,
  loadUsers,
  findUser,
  registerOrUpdateUser,
  verifyUser,
  loadRooms,
  saveRooms,
  addRoom
};
