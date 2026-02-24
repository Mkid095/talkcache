/**
 * SIDEBAR ROOMS
 * Handles the rooms list in the sidebar
 * File: frontend/js/ui/sidebar/sidebar-rooms.js
 */

import { $, $$, delegate, escapeHtml } from '../../utils/helpers.js';
import {
  getRooms,
  getCurrentRoom,
  getPrivateRecipient,
  roomExists
} from '../../state.js';

let elements = {};
let callbacks = {};

/**
 * Get DOM element references
 */
function initElements() {
  elements = {
    roomsList: $('#rooms-list'),
    createRoomForm: $('#create-room-form'),
    newRoomInput: $('#new-room-input'),
    createRoomBtn: $('.btn-icon-small', $('#create-room-form'))
  };
}

/**
 * Render the list of rooms
 * @param {string} currentRoom - Currently active room
 */
function renderRooms(currentRoom = getCurrentRoom()) {
  const rooms = getRooms();
  const list = elements.roomsList;

  if (!list) return;

  list.innerHTML = '';

  rooms.forEach(room => {
    const li = document.createElement('li');
    const isActive = !getPrivateRecipient() && room === currentRoom;

    li.innerHTML = `
      <button class="room-btn ${isActive ? 'active' : ''}" data-room="${escapeHtml(room)}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="4" y1="9" x2="20" y2="9"></line>
          <line x1="4" y1="15" x2="20" y2="15"></line>
          <line x1="10" y1="3" x2="8" y2="21"></line>
          <line x1="16" y1="3" x2="14" y2="21"></line>
        </svg>
        ${escapeHtml(room)}
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

  const li = document.createElement('li');
  li.innerHTML = `
    <button class="room-btn" data-room="${escapeHtml(room)}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="4" y1="9" x2="20" y2="9"></line>
        <line x1="4" y1="15" x2="20" y2="15"></line>
        <line x1="10" y1="3" x2="8" y2="21"></line>
        <line x1="16" y1="3" x2="14" y2="21"></line>
      </svg>
      ${escapeHtml(room)}
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
 * Get the new room name from input
 * @returns {string} Room name
 */
function getNewRoomInput() {
  return elements.newRoomInput?.value?.trim() || '';
}

/**
 * Clear the room input
 */
function clearNewRoomInput() {
  if (elements.newRoomInput) {
    elements.newRoomInput.value = '';
  }
  updateCreateRoomButton();
}

/**
 * Enable/disable create button
 */
function updateCreateRoomButton() {
  const roomName = getNewRoomInput();
  if (elements.createRoomBtn) {
    elements.createRoomBtn.disabled = !roomName || roomExists(roomName);
  }
}

/**
 * Handle create room form
 */
function handleCreateRoom(onCreate) {
  return function(event) {
    event.preventDefault();

    const roomName = getNewRoomInput();

    if (!roomName || roomExists(roomName)) {
      return;
    }

    if (typeof onCreate === 'function') {
      onCreate(roomName);
    }

    clearNewRoomInput();
  };
}

/**
 * Register callback for room selection
 * @param {Function} callback - Function to call
 */
function onRoomSelect(callback) {
  callbacks.onRoomSelect = callback;
}

/**
 * Register callback for room creation
 * @param {Function} callback - Function to call
 */
function onCreateRoom(callback) {
  callbacks.onCreateRoom = callback;
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
  if (options.onCreateRoom) onCreateRoom(options.onCreateRoom);

  if (elements.createRoomForm && options.onCreateRoom) {
    const { on } = require('../../utils/helpers.js');
    on(elements.createRoomForm, 'submit', handleCreateRoom(options.onCreateRoom));
  }

  if (elements.newRoomInput) {
    on(elements.newRoomInput, 'input', updateCreateRoomButton);
  }

  setupRoomEvents();
}

export {
  initRooms,
  renderRooms,
  addRoomToList,
  updateActiveRoom,
  getNewRoomInput,
  clearNewRoomInput
};
