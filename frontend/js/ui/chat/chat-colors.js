/**
 * CHAT COLORS
 * Handles room and user color assignments
 * File: frontend/js/ui/chat/chat-colors.js
 */

// =============================================
// USER COLORS
// =============================================

const USER_COLORS = [
  '#e74c3c', // Red
  '#9b59b6', // Purple
  '#3498db', // Blue
  '#1abc9c', // Teal
  '#2ecc71', // Green
  '#f39c12', // Orange
  '#e67e22', // Carrot
  '#d35400', // Pumpkin
  '#34495e', // Midnight Blue
  '#16a085', // Green Sea
  '#27ae60', // Nephritis
  '#2980b9', // Belize Hole
  '#8e44ad', // Wisteria
  '#c0392b', // Pomegranate
  '#7f8c8d'  // Gray
];

/**
 * Get a consistent color for a user based on their username
 * @param {string} username - Username
 * @returns {string} Hex color
 */
function getUserColor(username) {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return USER_COLORS[Math.abs(hash) % USER_COLORS.length];
}

// =============================================
// ROOM BACKGROUND COLORS
// =============================================

const ROOM_BG_COLORS = [
  ['rgba(100, 181, 246, 0.20)', 'rgba(66, 165, 245, 0.15)'], // Blue
  ['rgba(255, 152, 0, 0.18)', 'rgba(245, 124, 0, 0.14)'],    // Orange
  ['rgba(102, 187, 106, 0.20)', 'rgba(67, 160, 71, 0.15)'],  // Green
  ['rgba(171, 71, 188, 0.18)', 'rgba(142, 36, 170, 0.14)'],  // Purple
  ['rgba(236, 64, 122, 0.18)', 'rgba(216, 27, 96, 0.14)'],   // Pink
  ['rgba(255, 238, 88, 0.22)', 'rgba(253, 216, 53, 0.18)'],  // Yellow
  ['rgba(38, 198, 218, 0.20)', 'rgba(0, 172, 193, 0.15)'],   // Cyan
  ['rgba(255, 167, 38, 0.18)', 'rgba(255, 112, 67, 0.14)'],  // Deep Orange
  ['rgba(120, 144, 156, 0.18)', 'rgba(84, 110, 122, 0.14)'], // Blue Gray
  ['rgba(126, 87, 194, 0.18)', 'rgba(94, 53, 177, 0.14)'],   // Deep Purple
  ['rgba(239, 83, 80, 0.18)', 'rgba(229, 57, 53, 0.14)'],    // Red
  ['rgba(156, 204, 101, 0.20)', 'rgba(124, 179, 66, 0.15)'], // Light Green
  ['rgba(41, 182, 246, 0.20)', 'rgba(3, 155, 229, 0.15)'],   // Light Blue
  ['rgba(240, 98, 146, 0.18)', 'rgba(233, 30, 99, 0.14)'],   // Hot Pink
  ['rgba(255, 167, 38, 0.18)', 'rgba(251, 140, 0, 0.14)']    // Amber
];

/**
 * Get a consistent background gradient for a room
 * @param {string} roomName - Room name
 * @returns {string} CSS gradient string
 */
function getRoomBackground(roomName) {
  let hash = 0;
  for (let i = 0; i < roomName.length; i++) {
    hash = roomName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % ROOM_BG_COLORS.length;
  const colors = ROOM_BG_COLORS[index];
  return `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`;
}

/**
 * Update the room background
 * @param {HTMLElement} container - Messages container
 * @param {string} room - Room name
 * @param {Object} recipient - Private chat recipient
 */
function updateRoomBackground(container, room, recipient = null) {
  if (!container) return;

  // Private chat has subtle solid background
  if (recipient) {
    container.style.background = 'rgba(255, 152, 0, 0.12)';
    return;
  }

  // Set room background
  container.style.background = getRoomBackground(room);
  container.setAttribute('data-room', room);
}

export {
  USER_COLORS,
  getUserColor,
  ROOM_BG_COLORS,
  getRoomBackground,
  updateRoomBackground
};
