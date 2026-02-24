/**
 * MOBILE ROOMS MODAL
 * Handles rooms list rendering and create room form in mobile modal
 * File: frontend/js/ui/mobile/mobile-rooms-modal.js
 */

import { on, escapeHtml } from '../../utils/helpers.js';
import {
  getRooms,
  getCurrentRoom,
  getPrivateRecipient,
  roomExists,
  getRoomUnread
} from '../../state.js';

/**
 * Render rooms list in modal
 * @param {Object} elements - Optional DOM elements object
 */
function renderModalRooms(elements = null) {
  if (!elements) {
    elements = {
      modalRoomsList: document.getElementById('modal-rooms-list')
    };
  }

  const rooms = getRooms();
  const list = elements.modalRoomsList;
  const currentRoom = getCurrentRoom();
  const privateRecipient = getPrivateRecipient();

  if (!list) return;

  // Clear list
  list.innerHTML = '';

  // Add each room
  rooms.forEach(room => {
    const li = document.createElement('li');
    li.className = 'modal-room-item';

    const isActive = !privateRecipient && room === currentRoom;
    const unreadCount = getRoomUnread(room);

    li.innerHTML = `
      <button class="modal-room-btn ${isActive ? 'active' : ''}" data-room="${escapeHtml(room)}">
        <div class="modal-room-icon-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="4" y1="9" x2="20" y2="9"></line>
            <line x1="4" y1="15" x2="20" y2="15"></line>
            <line x1="10" y1="3" x2="8" y2="21"></line>
            <line x1="16" y1="3" x2="14" y2="21"></line>
          </svg>
          ${unreadCount > 0 ? `<span class="modal-room-unread-badge">${unreadCount > 99 ? '99+' : unreadCount}</span>` : ''}
        </div>
        <span class="modal-room-name">${escapeHtml(room)}</span>
        ${isActive ? '<span class="modal-room-indicator"></span>' : ''}
      </button>
    `;

    list.appendChild(li);
  });
}

/**
 * Add a single room to the modal list
 * @param {string} room - Room name
 * @param {Object} elements - Optional DOM elements object
 */
function addModalRoomToList(room, elements = null) {
  if (!elements) {
    elements = {
      modalRoomsList: document.getElementById('modal-rooms-list')
    };
  }

  const list = elements.modalRoomsList;
  if (!list) return;

  const currentRoom = getCurrentRoom();
  const privateRecipient = getPrivateRecipient();
  const isActive = !privateRecipient && room === currentRoom;
  const unreadCount = getRoomUnread(room);

  const li = document.createElement('li');
  li.className = 'modal-room-item';
  li.innerHTML = `
    <button class="modal-room-btn ${isActive ? 'active' : ''}" data-room="${escapeHtml(room)}">
      <div class="modal-room-icon-wrapper">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="4" y1="9" x2="20" y2="9"></line>
          <line x1="4" y1="15" x2="20" y2="15"></line>
          <line x1="10" y1="3" x2="8" y2="21"></line>
          <line x1="16" y1="3" x2="14" y2="21"></line>
        </svg>
        ${unreadCount > 0 ? `<span class="modal-room-unread-badge">${unreadCount > 99 ? '99+' : unreadCount}</span>` : ''}
      </div>
      <span class="modal-room-name">${escapeHtml(room)}</span>
      ${isActive ? '<span class="modal-room-indicator"></span>' : ''}
    </button>
  `;

  list.appendChild(li);
}

// =============================================
// CREATE ROOM FORM (Modal)
// =============================================

/**
 * Get the new room name from modal input
 * @param {Object} elements - Optional DOM elements object
 * @returns {string} Room name
 */
function getModalRoomInput(elements = null) {
  if (!elements) {
    elements = { modalRoomInput: document.getElementById('modal-room-input') };
  }
  return elements.modalRoomInput?.value?.trim() || '';
}

/**
 * Clear the modal input
 * @param {Object} elements - Optional DOM elements object
 */
function clearModalRoomInput(elements = null) {
  if (!elements) {
    elements = { modalRoomInput: document.getElementById('modal-room-input') };
  }
  if (elements.modalRoomInput) {
    elements.modalRoomInput.value = '';
  }
  updateModalCreateRoomButton(elements);
}

/**
 * Enable/disable create button
 * @param {Object} elements - Optional DOM elements object
 */
function updateModalCreateRoomButton(elements = null) {
  if (!elements) {
    elements = {
      modalRoomInput: document.getElementById('modal-room-input'),
      modalCreateRoomBtn: document.getElementById('modal-create-room-btn')
    };
  }
  const roomName = getModalRoomInput(elements);
  if (elements.modalCreateRoomBtn) {
    elements.modalCreateRoomBtn.disabled = !roomName || roomExists(roomName);
  }
}

/**
 * Handle create room form in modal
 * @param {Object} elements - DOM elements object
 * @param {Function} onCreate - Create room callback
 * @param {Function} closeRoomsModal - Function to close modal
 * @returns {Function} Event handler
 */
function handleModalCreateRoom(elements, onCreate, closeRoomsModal) {
  return function(event) {
    event.preventDefault();

    const roomName = getModalRoomInput(elements);

    if (!roomName || roomExists(roomName)) {
      return;
    }

    // Call the create callback
    if (typeof onCreate === 'function') {
      onCreate(roomName);
    }

    clearModalRoomInput(elements);
    closeRoomsModal();
  };
}

/**
 * Set up event delegation for room clicks
 * @param {Object} elements - DOM elements object
 * @param {Object} callbacks - Callback functions
 * @param {Function} closeRoomsModal - Function to close modal
 */
function setupRoomsEventDelegation(elements, callbacks, closeRoomsModal) {
  if (elements.modalRoomsList) {
    elements.modalRoomsList.addEventListener('click', (event) => {
      const btn = event.target.closest('.modal-room-btn');
      if (btn && callbacks.onRoomSelect) {
        const room = btn.getAttribute('data-room');
        if (room) {
          callbacks.onRoomSelect(room);
          closeRoomsModal();
        }
      }
    });
  }
}

/**
 * Set up create room form handlers
 * @param {Object} elements - DOM elements object
 * @param {Object} callbacks - Callback functions
 * @param {Function} closeRoomsModal - Function to close modal
 */
function setupCreateRoomForm(elements, callbacks, closeRoomsModal) {
  // Create room form in modal
  if (elements.modalCreateRoomForm && callbacks.onCreateRoom) {
    on(elements.modalCreateRoomForm, 'submit',
      handleModalCreateRoom(elements, callbacks.onCreateRoom, closeRoomsModal));
  }

  // Input change handler
  if (elements.modalRoomInput) {
    on(elements.modalRoomInput, 'input', () => {
      updateModalCreateRoomButton(elements);
    });
  }
}

export {
  renderModalRooms,
  addModalRoomToList,
  getModalRoomInput,
  clearModalRoomInput,
  updateModalCreateRoomButton,
  handleModalCreateRoom,
  setupRoomsEventDelegation,
  setupCreateRoomForm
};
