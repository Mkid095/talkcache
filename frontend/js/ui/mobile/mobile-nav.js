/**
 * MOBILE NAVIGATION COORDINATOR
 * Main module for mobile navigation bar and modal management
 * File: frontend/js/ui/mobile/mobile-nav.js
 */

import { $, on } from '../../utils/helpers.js';
import { getUsername, getTotalUnreadCount, getTotalRoomUnread } from '../../state.js';
import {
  renderModalRooms,
  addModalRoomToList,
  setupRoomsEventDelegation,
  setupCreateRoomForm
} from './mobile-rooms-modal.js';
import {
  renderModalUsers,
  setupUsersEventDelegation
} from './mobile-users-modal.js';

// DOM elements
let elements = {};
let callbacks = {};

function initElements() {
  elements = {
    mobileUsername: $('#mobile-username'),
    mobileRoomsBtn: $('#mobile-rooms-btn'),
    mobileUsersBtn: $('#mobile-users-btn'),
    mobileLogoutBtn: $('#mobile-logout-btn'),
    roomsModal: $('#rooms-modal'),
    usersModal: $('#users-modal'),
    roomsModalClose: $('#rooms-modal-close'),
    usersModalClose: $('#users-modal-close'),
    modalRoomsList: $('#modal-rooms-list'),
    modalUsersList: $('#modal-users-list'),
    modalCreateRoomForm: $('#modal-create-room-form'),
    modalRoomInput: $('#modal-room-input'),
    modalCreateRoomBtn: $('#modal-create-room-btn')
  };
}

// Modal visibility
function openRoomsModal() {
  if (elements.roomsModal) {
    elements.roomsModal.classList.add('active');
    renderModalRooms(elements);
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
    renderModalUsers(elements);
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

// UI updates
function updateMobileUsername() {
  const username = getUsername();
  if (elements.mobileUsername && username) {
    elements.mobileUsername.textContent = username;
  }
}

function updateUsersBadge() {
  const totalUnread = getTotalUnreadCount();
  const usersBtn = elements.mobileUsersBtn;

  if (!usersBtn) return;

  const existingBadge = usersBtn.querySelector('.nav-btn-badge');
  if (existingBadge) {
    existingBadge.remove();
  }

  if (totalUnread > 0) {
    const badge = document.createElement('span');
    badge.className = 'nav-btn-badge';
    badge.textContent = totalUnread > 99 ? '99+' : totalUnread;
    usersBtn.appendChild(badge);
  }
}

function updateRoomsBadge() {
  const totalUnread = getTotalRoomUnread();
  const roomsBtn = elements.mobileRoomsBtn;

  if (!roomsBtn) return;

  const existingBadge = roomsBtn.querySelector('.nav-btn-badge');
  if (existingBadge) {
    existingBadge.remove();
  }

  if (totalUnread > 0) {
    const badge = document.createElement('span');
    badge.className = 'nav-btn-badge nav-btn-badge-center';
    badge.textContent = totalUnread > 99 ? '99+' : totalUnread;
    roomsBtn.appendChild(badge);
  }
}

// Initialization
function initMobileNav(options = {}) {
  initElements();

  callbacks.onRoomSelect = options.onRoomSelect;
  callbacks.onUserSelect = options.onUserSelect;
  callbacks.onCreateRoom = options.onCreateRoom;

  // Nav buttons
  if (elements.mobileRoomsBtn) {
    on(elements.mobileRoomsBtn, 'click', (e) => {
      e.preventDefault();
      openRoomsModal();
    });
  }

  if (elements.mobileUsersBtn) {
    on(elements.mobileUsersBtn, 'click', (e) => {
      e.preventDefault();
      openUsersModal();
    });
  }

  if (elements.mobileLogoutBtn && options.onLogout) {
    on(elements.mobileLogoutBtn, 'click', options.onLogout);
  }

  // Modal close buttons
  if (elements.roomsModalClose) {
    on(elements.roomsModalClose, 'click', closeRoomsModal);
  }
  if (elements.usersModalClose) {
    on(elements.usersModalClose, 'click', closeUsersModal);
  }

  // Close on backdrop click
  if (elements.roomsModal) {
    on(elements.roomsModal, 'click', (e) => {
      if (e.target === elements.roomsModal) closeRoomsModal();
    });
  }
  if (elements.usersModal) {
    on(elements.usersModal, 'click', (e) => {
      if (e.target === elements.usersModal) closeUsersModal();
    });
  }

  // Set up event delegation
  setupRoomsEventDelegation(elements, callbacks, closeRoomsModal);
  setupUsersEventDelegation(elements, callbacks, closeUsersModal);
  setupCreateRoomForm(elements, callbacks, closeRoomsModal);

  console.log('[MobileNav] Ready');
}

export {
  initMobileNav,
  renderModalRooms,
  addModalRoomToList,
  renderModalUsers,
  openRoomsModal,
  openUsersModal,
  closeAllModals,
  updateMobileUsername,
  updateUsersBadge,
  updateRoomsBadge
};
