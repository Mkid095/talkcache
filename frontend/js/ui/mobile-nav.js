/**
 * MOBILE NAVIGATION
 * Handles bottom navigation bar and modals for mobile devices
 * File: frontend/js/ui/mobile-nav.js
 */

// Import helper functions
import { $, on, escapeHtml } from '../utils/helpers.js';
import {
  getRooms, getUsers, getCurrentRoom, getPrivateRecipient,
  getSocketId, isMe, roomExists, getUsername
} from '../state.js';

// DOM elements
let elements = {};

// Color palette for users - must match backend
const USER_COLORS = [
  '#e74c3c', '#9b59b6', '#3498db', '#1abc9c', '#f39c12',
  '#e67e22', '#16a085', '#27ae60', '#2980b9', '#8e44ad',
  '#2c3e50', '#f1c40f', '#e67e22', '#d35400', '#c0392b'
];

/**
 * Get a consistent color for a username
 * @param {string} username - Username
 * @returns {string} Hex color code
 */
function getUserColor(username) {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % USER_COLORS.length;
  return USER_COLORS[index];
}

/**
 * Get references to DOM elements
 */
function initElements() {
  elements = {
    // Mobile header
    mobileUsername: $('#mobile-username'),

    // Mobile nav buttons
    mobileRoomsBtn: $('#mobile-rooms-btn'),
    mobileUsersBtn: $('#mobile-users-btn'),
    mobileLogoutBtn: $('#mobile-logout-btn'),

    // Modals
    roomsModal: $('#rooms-modal'),
    usersModal: $('#users-modal'),

    // Modal close buttons
    roomsModalClose: $('#rooms-modal-close'),
    usersModalClose: $('#users-modal-close'),

    // Modal content
    modalRoomsList: $('#modal-rooms-list'),
    modalUsersList: $('#modal-users-list'),

    // Create room form in modal
    modalCreateRoomForm: $('#modal-create-room-form'),
    modalRoomInput: $('#modal-room-input'),
    modalCreateRoomBtn: $('#modal-create-room-btn')
  };
}

// =============================================
// MODAL VISIBILITY
// =============================================

function openRoomsModal() {
  if (elements.roomsModal) {
    elements.roomsModal.classList.add('active');
    renderModalRooms();
  }
}

function closeRoomsModal() {
  if (elements.roomsModal) {
    elements.roomsModal.classList.remove('active');
  }
}

function openUsersModal() {
  if (elements.usersModal) {
    elements.usersModal.classList.add('active');
    renderModalUsers();
  }
}

function closeUsersModal() {
  if (elements.usersModal) {
    elements.usersModal.classList.remove('active');
  }
}

function closeAllModals() {
  closeRoomsModal();
  closeUsersModal();
}

// =============================================
// RENDER MODAL CONTENT
// =============================================

/**
 * Render rooms list in modal
 */
function renderModalRooms() {
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

    li.innerHTML = `
      <button class="modal-room-btn ${isActive ? 'active' : ''}" data-room="${escapeHtml(room)}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="4" y1="9" x2="20" y2="9"></line>
          <line x1="4" y1="15" x2="20" y2="15"></line>
          <line x1="10" y1="3" x2="8" y2="21"></line>
          <line x1="16" y1="3" x2="14" y2="21"></line>
        </svg>
        <span class="modal-room-name">${escapeHtml(room)}</span>
        ${isActive ? '<span class="modal-room-indicator"></span>' : ''}
      </button>
    `;

    list.appendChild(li);
  });
}

/**
 * Render users list in modal
 */
function renderModalUsers() {
  const users = getUsers();
  const list = elements.modalUsersList;
  const privateRecipient = getPrivateRecipient();

  if (!list) return;

  // Clear list
  list.innerHTML = '';

  // Add each user
  users.forEach(user => {
    const li = document.createElement('li');
    li.className = 'modal-user-item';

    const isCurrentUser = isMe(user);
    const isActive = privateRecipient && privateRecipient.id === user.id;

    // Get user's color
    let userColor = user.color;
    if (!userColor && user.name) {
      userColor = getUserColor(user.name);
    }
    userColor = userColor || '#5cd387';

    li.innerHTML = `
      <button
        class="modal-user-btn ${isActive ? 'active' : ''}"
        data-user-id="${escapeHtml(user.id)}"
        ${isCurrentUser ? 'disabled' : ''}
      >
        <div class="modal-user-icon-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="${userColor}" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <div class="modal-user-info">
          <span class="modal-user-name" style="color: ${userColor}; font-weight: 500;">${escapeHtml(user.name)}</span>
          <span class="modal-user-badge">${isCurrentUser ? '(You)' : 'Tap to message'}</span>
        </div>
      </button>
    `;

    list.appendChild(li);
  });
}

// =============================================
// CREATE ROOM FORM (Modal)
// =============================================

/**
 * Get the new room name from modal input
 */
function getModalRoomInput() {
  return elements.modalRoomInput?.value?.trim() || '';
}

/**
 * Clear the modal input
 */
function clearModalRoomInput() {
  if (elements.modalRoomInput) {
    elements.modalRoomInput.value = '';
  }
  updateModalCreateRoomButton();
}

/**
 * Enable/disable create button
 */
function updateModalCreateRoomButton() {
  const roomName = getModalRoomInput();
  if (elements.modalCreateRoomBtn) {
    elements.modalCreateRoomBtn.disabled = !roomName || roomExists(roomName);
  }
}

/**
 * Handle create room form in modal
 */
function handleModalCreateRoom(onCreate) {
  return function(event) {
    event.preventDefault();

    const roomName = getModalRoomInput();

    if (!roomName || roomExists(roomName)) {
      return;
    }

    // Call the create callback
    if (typeof onCreate === 'function') {
      onCreate(roomName);
    }

    clearModalRoomInput();
    closeRoomsModal();
  };
}

// =============================================
// EVENT DELEGATION
// =============================================

function setupEventDelegation() {
  // Room clicks in modal
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

  // User clicks in modal
  if (elements.modalUsersList) {
    elements.modalUsersList.addEventListener('click', (event) => {
      const btn = event.target.closest('.modal-user-btn');
      if (btn && callbacks.onUserSelect) {
        const userId = btn.getAttribute('data-user-id');
        if (userId) {
          callbacks.onUserSelect(userId);
          closeUsersModal();
        }
      }
    });
  }
}

// =============================================
// CALLBACKS
// =============================================

let callbacks = {};

function onRoomSelect(callback) {
  callbacks.onRoomSelect = callback;
}

function onUserSelect(callback) {
  callbacks.onUserSelect = callback;
}

// =============================================
// INITIALIZATION
// =============================================

/**
 * Update mobile header username
 */
function updateMobileUsername() {
  const username = getUsername();
  if (elements.mobileUsername && username) {
    elements.mobileUsername.textContent = username;
  }
}

/**
 * Set up the mobile navigation
 * @param {Object} options - Callback functions
 */
function initMobileNav(options = {}) {
  initElements();

  // Register callbacks
  if (options.onRoomSelect) onRoomSelect(options.onRoomSelect);
  if (options.onUserSelect) onUserSelect(options.onUserSelect);

  // Open rooms modal
  if (elements.mobileRoomsBtn) {
    on(elements.mobileRoomsBtn, 'click', (e) => {
      e.preventDefault();
      openRoomsModal();
    });
  }

  // Open users modal
  if (elements.mobileUsersBtn) {
    on(elements.mobileUsersBtn, 'click', (e) => {
      e.preventDefault();
      openUsersModal();
    });
  }

  // Logout button
  if (elements.mobileLogoutBtn && options.onLogout) {
    on(elements.mobileLogoutBtn, 'click', options.onLogout);
  }

  // Close modals with close buttons
  if (elements.roomsModalClose) {
    on(elements.roomsModalClose, 'click', closeRoomsModal);
  }
  if (elements.usersModalClose) {
    on(elements.usersModalClose, 'click', closeUsersModal);
  }

  // Close modals when clicking outside
  if (elements.roomsModal) {
    on(elements.roomsModal, 'click', closeRoomsModal);
  }
  if (elements.usersModal) {
    on(elements.usersModal, 'click', closeUsersModal);
  }

  // Create room form in modal
  if (elements.modalCreateRoomForm && options.onCreateRoom) {
    on(elements.modalCreateRoomForm, 'submit', handleModalCreateRoom(options.onCreateRoom));
  }

  // Input change handler
  if (elements.modalRoomInput) {
    on(elements.modalRoomInput, 'input', updateModalCreateRoomButton);
  }

  // Set up event delegation
  setupEventDelegation();

  console.log('[MobileNav] Ready');
}

// Export functions
export {
  initMobileNav,
  renderModalRooms,
  renderModalUsers,
  openRoomsModal,
  openUsersModal,
  closeAllModals,
  updateMobileUsername
};
