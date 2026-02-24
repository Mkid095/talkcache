/**
 * SCROLL TRACKER
 * Handles scroll-based message read tracking
 * File: frontend/js/utils/scroll-tracker.js
 */

import {
  getCurrentRoom,
  getMessages,
  setRoomUnread
} from '../state.js';

import {
  getVisibleMessageIds,
  markMessagesAsRead,
  readMessageIds
} from './unread-tracker.js';

import { renderRooms } from '../ui/sidebar.js';
import { renderModalRooms } from '../ui/mobile/mobile-nav.js';

let elements = {};
let isHandlerSetup = false;
let scrollTimeout = null;

/**
 * Initialize scroll tracker
 * @param {HTMLElement} container - Messages container
 */
function initScrollTracker(container) {
  if (!container) return;

  elements = { container };

  if (!isHandlerSetup) {
    container.addEventListener('scroll', handleScroll, { passive: true });
    isHandlerSetup = true;
  }
}

/**
 * Handle scroll events with debouncing
 */
function handleScroll() {
  // Clear existing timeout
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }

  // Debounce - wait 100ms after scrolling stops before processing
  scrollTimeout = setTimeout(() => {
    processScroll();
  }, 100);
}

/**
 * Process scroll and mark messages as read
 */
function processScroll() {
  const container = elements.container;
  const currentRoom = getCurrentRoom();

  if (!container || !currentRoom) return;

  // Get visible message IDs
  const visibleIds = getVisibleMessageIds(container);

  if (visibleIds.length === 0) return;

  // Mark messages as read and get count of newly read
  const newlyRead = markMessagesAsRead(visibleIds, currentRoom);

  // If messages were marked as read, update room display
  if (newlyRead > 0) {
    updateRoomUnreadFromScroll(currentRoom);
  }
}

/**
 * Update room unread count based on scroll position
 * @param {string} room - Room name
 */
function updateRoomUnreadFromScroll(room) {
  const allMessages = getMessages();
  const roomMessages = allMessages.filter(msg => msg.room === room && !msg.isPrivate);

  // Calculate how many room messages are NOT yet read
  // We count from the end backwards until we find the last read message
  let unreadCount = 0;
  let foundRead = false;

  // Count backwards from newest
  for (let i = roomMessages.length - 1; i >= 0; i--) {
    const msg = roomMessages[i];

    if (readMessageIds.has(msg.id)) {
      foundRead = true;
    } else if (!foundRead) {
      unreadCount++;
    } else {
      break;
    }
  }

  // Update state with new count
  setRoomUnread(room, unreadCount);

  // Update UI
  renderRooms();
  renderModalRooms();
}

/**
 * Reset scroll tracker (for room changes)
 */
function resetScrollTracker() {
  // Will re-initialize on first scroll
}

export {
  initScrollTracker,
  processScroll,
  resetScrollTracker
};

