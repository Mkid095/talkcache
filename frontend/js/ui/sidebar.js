/**
 * SIDEBAR
 * Main sidebar module that coordinates all sidebar functionality
 * File: frontend/js/ui/sidebar.js
 */

import { $, on } from '../utils/helpers.js';
import {
  getCurrentRoom,
  getPrivateRecipient
} from '../state.js';

import { getUserColor } from './sidebar/sidebar-colors.js';

import {
  initRooms,
  renderRooms,
  addRoomToList,
  updateActiveRoom
} from './sidebar/sidebar-rooms.js';

import {
  initCreateRoomForm
} from './sidebar/sidebar-rooms-form.js';

import {
  initUsers,
  renderUsers
} from './sidebar/sidebar-users.js';

let elements = {};
let callbacks = {};

/**
 * Initialize sidebar elements
 */
function initElements() {
  elements = {
    sidebar: $('.sidebar'),
    chatTitle: $('#chat-title'),
    hashIcon: $('.hash-icon'),
    userIcon: $('.user-icon'),
    privateBadge: $('#private-badge')
  };
}

/**
 * Update the chat header
 * @param {string} room - Room name
 * @param {Object} recipient - Private chat recipient
 */
function updateChatHeader(room, recipient = null) {
  const chatTitle = elements.chatTitle;
  const privateBadge = elements.privateBadge;
  const hashIcon = elements.hashIcon;
  const userIcon = elements.userIcon;

  if (!chatTitle) return;

  if (recipient) {
    chatTitle.textContent = recipient.name;
    if (privateBadge) privateBadge.classList.remove('hidden');
    if (hashIcon) hashIcon.style.display = 'none';
    if (userIcon) userIcon.style.display = 'inline-block';
  } else {
    chatTitle.textContent = room;
    if (privateBadge) privateBadge.classList.add('hidden');
    if (hashIcon) hashIcon.style.display = 'inline-block';
    if (userIcon) userIcon.style.display = 'none';
  }
}

/**
 * Register callbacks
 */
function onRoomSelect(callback) {
  callbacks.onRoomSelect = callback;
}

function onUserSelect(callback) {
  callbacks.onUserSelect = callback;
}

function onCreateRoom(callback) {
  callbacks.onCreateRoom = callback;
}

/**
 * Initialize the sidebar
 * @param {Object} options - Callback functions
 */
function initSidebar(options = {}) {
  initElements();

  // Register callbacks
  if (options.onRoomSelect) {
    onRoomSelect(options.onRoomSelect);
    callbacks.onRoomSelect = options.onRoomSelect;
  }
  if (options.onUserSelect) {
    onUserSelect(options.onUserSelect);
    callbacks.onUserSelect = options.onUserSelect;
  }

  // Initialize sub-modules
  initRooms({
    onRoomSelect: options.onRoomSelect
  });

  initCreateRoomForm({
    onCreateRoom: options.onCreateRoom
  });

  initUsers({
    onUserSelect: options.onUserSelect
  });

  console.log('[Sidebar] Ready');
}

// Export all functions
export {
  initSidebar,
  renderRooms,
  addRoomToList,
  renderUsers,
  updateActiveRoom,
  updateChatHeader,
  onRoomSelect,
  onUserSelect,
  onCreateRoom,
  getUserColor
};
