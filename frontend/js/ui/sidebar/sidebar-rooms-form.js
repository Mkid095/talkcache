/**
 * SIDEBAR CREATE ROOM FORM
 * Handles room creation form in sidebar
 * File: frontend/js/ui/sidebar/sidebar-rooms-form.js
 */

import { $, on, escapeHtml } from '../../utils/helpers.js';
import {
  getRoomUnread,
  roomExists
} from '../../state.js';

let elements = {};
let callbacks = {};

/**
 * Get DOM element references
 */
function initElements() {
  elements = {
    createRoomForm: $('#create-room-form'),
    newRoomInput: $('#new-room-input'),
    createRoomBtn: $('.btn-icon-small', $('#create-room-form'))
  };
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
 * Register callback for room creation
 * @param {Function} callback - Function to call
 */
function onCreateRoom(callback) {
  callbacks.onCreateRoom = callback;
}

/**
 * Initialize create room form
 * @param {Object} options - Configuration
 */
function initCreateRoomForm(options = {}) {
  initElements();

  if (options.onCreateRoom) onCreateRoom(options.onCreateRoom);

  if (elements.createRoomForm && options.onCreateRoom) {
    on(elements.createRoomForm, 'submit', handleCreateRoom(options.onCreateRoom));
  }

  if (elements.newRoomInput) {
    on(elements.newRoomInput, 'input', updateCreateRoomButton);
  }
}

export {
  initCreateRoomForm,
  getNewRoomInput,
  clearNewRoomInput,
  updateCreateRoomButton
};
