/**
 * SIDEBAR ROOMS RENDERING
 * Handles the rooms list display in the sidebar
 * File: frontend/js/ui/sidebar/sidebar-rooms.js
 */

import { $, $$, delegate, escapeHtml } from '../../utils/helpers.js';
import {
  getRooms,
  getCurrentRoom,
  getPrivateRecipient,
  getRoomUnread
} from '../../state.js';

let elements = {};
let callbacks = {};

/**
 * Get DOM element references
 */
function initElements() {
  elements = {
    roomsList: $('#rooms-list')
  };

  console.log('[SidebarRooms] initElements:', {
    roomsList: elements.roomsList,
    found: !!elements.roomsList
  });
}

/**
 * Render the list of rooms
 * @param {string} currentRoom - Currently active room
 */
function renderRooms(currentRoom = getCurrentRoom()) {
  const rooms = getRooms();
  const list = elements.roomsList;

  console.log('[SidebarRooms] renderRooms called:', {
    rooms,
    roomsList: list,
    hasRoomsList: !!list
  });

  if (!list) {
    console.warn('[SidebarRooms] #rooms-list element not found!');
    return;
  }

  list.innerHTML = '';

  rooms.forEach(room => {
    const li = document.createElement('li');
    const isActive = !getPrivateRecipient() && room === currentRoom;
    const unreadCount = getRoomUnread(room);

    li.innerHTML = `
      <button class="room-btn ${isActive ? 'active' : ''}" data-room="${escapeHtml(room)}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="4" y1="9" x2="20" y2="9"></line>
          <line x1="4" y1="15" x2="20" y2="15"></line>
          <line x1="10" y1="3" x2="8" y2="21"></line>
          <line x1="16" y1="3" x2="14" y2="21"></line>
        </svg>
        <span class="room-name">${escapeHtml(room)}</span>
        ${unreadCount > 0 ? `<span class="room-unread-badge">${unreadCount > 99 ? '99+' : unreadCount}</span>` : ''}
      </button>
    `;

    list.appendChild(li);
  });
}

/**
 * Add a single room to the list
 * @param {string} room - Room name
 */
function addRoomToList(room) {
  const list = elements.roomsList;
  if (!list) return;

  const unreadCount = getRoomUnread(room);
  const li = document.createElement('li');
  li.innerHTML = `
    <button class="room-btn" data-room="${escapeHtml(room)}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="4" y1="9" x2="20" y2="9"></line>
        <line x1="4" y1="15" x2="20" y2="15"></line>
        <line x1="10" y1="3" x2="8" y2="21"></line>
        <line x1="16" y1="3" x2="14" y2="21"></line>
      </svg>
      <span class="room-name">${escapeHtml(room)}</span>
      ${unreadCount > 0 ? `<span class="room-unread-badge">${unreadCount > 99 ? '99+' : unreadCount}</span>` : ''}
    </button>
  `;

  list.appendChild(li);
}

/**
 * Update which room is highlighted
 * @param {string} activeRoom - Active room name
 */
function updateActiveRoom(activeRoom) {
  const buttons = $$('.room-btn');
  buttons.forEach(btn => {
    const room = btn.getAttribute('data-room');
    if (room === activeRoom && !getPrivateRecipient()) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

/**
 * Register callback for room selection
 * @param {Function} callback - Function to call
 */
function onRoomSelect(callback) {
  callbacks.onRoomSelect = callback;
}

/**
 * Set up room event delegation
 */
function setupRoomEvents() {
  if (elements.roomsList) {
    delegate(elements.roomsList, 'click', '.room-btn', function(event) {
      const room = this.getAttribute('data-room');
      if (room && callbacks.onRoomSelect) {
        callbacks.onRoomSelect(room);
      }
    });
  }
}

/**
 * Initialize rooms section
 * @param {Object} options - Configuration
 */
function initRooms(options = {}) {
  initElements();

  if (options.onRoomSelect) onRoomSelect(options.onRoomSelect);
  setupRoomEvents();
}

export {
  initRooms,
  renderRooms,
  addRoomToList,
  updateActiveRoom,
  onRoomSelect
};
