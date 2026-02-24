/**
 * MOBILE USERS MODAL
 * Handles users list rendering in mobile modal
 * File: frontend/js/ui/mobile/mobile-users-modal.js
 */

import { escapeHtml } from '../../utils/helpers.js';
import {
  getUsers,
  getPrivateRecipient,
  isMe,
  getUnreadCount
} from '../../state.js';

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
 * Render users list in modal
 * @param {Object} elements - Optional DOM elements object
 */
function renderModalUsers(elements = null) {
  if (!elements) {
    elements = {
      modalUsersList: document.getElementById('modal-users-list')
    };
  }

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
    const unreadCount = !isCurrentUser ? getUnreadCount(user.id) : 0;

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
          ${unreadCount > 0 ? `<span class="modal-user-unread-badge">${unreadCount}</span>` : ''}
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

/**
 * Set up event delegation for user clicks
 * @param {Object} elements - DOM elements object
 * @param {Object} callbacks - Callback functions
 * @param {Function} closeUsersModal - Function to close modal
 */
function setupUsersEventDelegation(elements, callbacks, closeUsersModal) {
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

export {
  renderModalUsers,
  getUserColor,
  setupUsersEventDelegation
};
