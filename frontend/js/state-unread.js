/**
 * STATE MANAGEMENT - UNREAD TRACKING
 * Handles unread message tracking for private chats and rooms
 * File: frontend/js/state-unread.js
 */

// Unread state - managed separately for modularity
let unreadPrivateMessages = {};
let unreadRoomMessages = {};

// =============================================
// UNREAD PRIVATE MESSAGE TRACKING
// =============================================

/**
 * Get unread count for a specific user
 * @param {string} userId - User's socket ID
 * @returns {number} Unread message count
 */
function getUnreadCount(userId) {
  return unreadPrivateMessages[userId] || 0;
}

/**
 * Get all unread message counts
 * @returns {Object} Map of userId to count
 */
function getAllUnreadCounts() {
  return { ...unreadPrivateMessages };
}

/**
 * Get total unread private message count
 * @returns {number} Total unread messages
 */
function getTotalUnreadCount() {
  return Object.values(unreadPrivateMessages).reduce((sum, count) => sum + count, 0);
}

/**
 * Increment unread count for a user
 * @param {string} userId - User's socket ID
 */
function incrementUnread(userId) {
  if (!unreadPrivateMessages[userId]) {
    unreadPrivateMessages[userId] = 0;
  }
  unreadPrivateMessages[userId]++;
}

/**
 * Clear unread count for a user (when opening their chat)
 * @param {string} userId - User's socket ID
 */
function clearUnread(userId) {
  delete unreadPrivateMessages[userId];
}

// =============================================
// ROOM UNREAD MESSAGE TRACKING
// =============================================

/**
 * Get unread count for a room
 * @param {string} room - Room name
 * @returns {number} Unread message count
 */
function getRoomUnread(room) {
  return unreadRoomMessages[room] || 0;
}

/**
 * Increment unread count for a room
 * @param {string} room - Room name
 */
function incrementRoomUnread(room) {
  if (!unreadRoomMessages[room]) {
    unreadRoomMessages[room] = 0;
  }
  unreadRoomMessages[room]++;
}

/**
 * Set unread count for a room
 * @param {string} room - Room name
 * @param {number} count - Unread count
 */
function setRoomUnread(room, count) {
  unreadRoomMessages[room] = count;
}

/**
 * Clear unread count for a room
 * @param {string} room - Room name
 */
function clearRoomUnread(room) {
  delete unreadRoomMessages[room];
}

/**
 * Get total unread count across all rooms
 * @returns {number} Total unread messages
 */
function getTotalRoomUnread() {
  return Object.values(unreadRoomMessages).reduce((sum, count) => sum + count, 0);
}

/**
 * Clear all unread counts (e.g., after logout)
 */
function clearAllUnread() {
  unreadPrivateMessages = {};
  unreadRoomMessages = {};
}

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
};
