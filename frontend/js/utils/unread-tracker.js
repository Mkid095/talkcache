/**
 * UNREAD MESSAGE TRACKER
 * Tracks unread messages per room and scroll-based read tracking
 * File: frontend/js/utils/unread-tracker.js
 */

import { getSocketId } from '../state.js';

// Track last read message ID per room
let lastReadMessagePerRoom = {};

// Track all message IDs that have been "read" (seen on screen)
let readMessageIds = new Set();

/**
 * Initialize unread tracking for a room
 * @param {string} room - Room name
 * @param {Array} messages - All messages in the room
 * @returns {number} Unread count
 */
function initRoomUnread(room, messages) {
  if (!lastReadMessagePerRoom[room]) {
    // First time viewing this room - mark all as read
    messages.forEach(msg => {
      if (msg.room === room && !msg.isPrivate) {
        readMessageIds.add(msg.id);
      }
    });
    if (messages.length > 0) {
      lastReadMessagePerRoom[room] = messages[messages.length - 1].id;
    }
    return 0;
  }

  // Calculate unread: messages after last read message
  let lastReadId = lastReadMessagePerRoom[room];
  let foundLastRead = false;
  let unreadCount = 0;

  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.room !== room || msg.isPrivate) continue;

    if (!foundLastRead) {
      if (msg.id === lastReadId) {
        foundLastRead = true;
      } else {
        unreadCount++;
      }
    } else {
      break;
    }
  }

  return unreadCount;
}

/**
 * Get unread count for a room
 * @param {string} room - Room name
 * @param {Array} allMessages - All messages
 * @returns {number} Unread count
 */
function getRoomUnreadCount(room, allMessages) {
  if (!lastReadMessagePerRoom[room]) {
    return initRoomUnread(room, allMessages);
  }
  return initRoomUnread(room, allMessages);
}

/**
 * Mark messages as read based on visible messages
 * @param {Array} visibleMessageIds - Message IDs currently visible
 * @param {string} room - Current room
 */
function markMessagesAsRead(visibleMessageIds, room) {
  let newReadCount = 0;

  visibleMessageIds.forEach(msgId => {
    if (!readMessageIds.has(msgId)) {
      readMessageIds.add(msgId);
      newReadCount++;
    }
  });

  // Update last read message for this room
  if (visibleMessageIds.length > 0) {
    const lastVisibleId = visibleMessageIds[visibleMessageIds.length - 1];
    lastReadMessagePerRoom[room] = lastVisibleId;
  }

  return newReadCount;
}

/**
 * Mark all messages in a room as read (when joining)
 * @param {string} room - Room name
 * @param {Array} messages - Messages in the room
 */
function markRoomAsRead(room, messages) {
  messages.forEach(msg => {
    if (msg.room === room && !msg.isPrivate) {
      readMessageIds.add(msg.id);
    }
  });

  if (messages.length > 0) {
    lastReadMessagePerRoom[room] = messages[messages.length - 1].id;
  }
}

/**
 * Clear all read tracking (for logout)
 */
function clearAllReadTracking() {
  lastReadMessagePerRoom = {};
  readMessageIds = new Set();
}

/**
 * Get message IDs that should be marked as read
 * based on scroll position
 * @param {HTMLElement} container - Messages container
 * @returns {Array} Array of visible message IDs
 */
function getVisibleMessageIds(container) {
  if (!container) return [];

  const containerRect = container.getBoundingClientRect();
  const scrollTop = container.scrollTop;
  const viewportBottom = scrollTop + containerRect.height;

  const messageElements = container.querySelectorAll('[data-message-id]');
  const visibleIds = [];

  messageElements.forEach(el => {
    const elTop = scrollTop + el.offsetTop;
    const elBottom = elTop + el.offsetHeight;

    // Consider message "visible" if at least partially in view
    // with some buffer at top for better UX
    if (elBottom > scrollTop - 50 && elTop < viewportBottom) {
      const messageId = el.getAttribute('data-message-id');
      if (messageId) {
        visibleIds.push(messageId);
      }
    }
  });

  return visibleIds;
}

export {
  initRoomUnread,
  getRoomUnreadCount,
  markMessagesAsRead,
  markRoomAsRead,
  clearAllReadTracking,
  getVisibleMessageIds,
  readMessageIds
};
