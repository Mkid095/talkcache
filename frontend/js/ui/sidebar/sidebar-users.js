/**
 * SIDEBAR USERS
 * Handles the users list in the sidebar
 * File: frontend/js/ui/sidebar/sidebar-users.js
 */

import { $, $$, delegate, escapeHtml } from '../../utils/helpers.js';
import {
  getUsers,
  getSocketId,
  getPrivateRecipient,
  isMe
} from '../../state.js';

import { getUserColor } from './sidebar-colors.js';

let elements = {};
let callbacks = {};

/**
 * Get DOM element references
 */
function initElements() {
  elements = {
    usersList: $('#users-list'),
    userCount: $('#user-count')
  };
}

/**
 * Render the list of online users
 */
function renderUsers() {
  const users = getUsers();
  const list = elements.usersList;
  const countElement = elements.userCount;
  const privateRecipient = getPrivateRecipient();

  if (!list) return;

  if (countElement) {
    countElement.textContent = users.length;
  }

  list.innerHTML = '';

  users.forEach(user => {
    const li = document.createElement('li');
    const isCurrentUser = isMe(user);
    const isActive = privateRecipient && privateRecipient.id === user.id;

    let userColor = user.color;
    if (!userColor && user.name) {
      userColor = getUserColor(user.name);
    }
    userColor = userColor || '#5cd387';

    li.innerHTML = `
      <button
        class="user-btn ${isActive ? 'active' : ''}"
        data-user-id="${escapeHtml(user.id)}"
        ${isCurrentUser ? 'disabled' : ''}
      >
        <span class="user-icon-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="${userColor}" stroke-width="2" style="color: ${userColor}">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </span>
        <span style="color: ${userColor}; font-weight: 500;">${escapeHtml(user.name)}</span>
        ${isCurrentUser ? ' <span style="color: var(--color-text-light);">(You)</span>' : ''}
      </button>
    `;

    list.appendChild(li);
  });
}

/**
 * Register callback for user selection
 * @param {Function} callback - Function to call
 */
function onUserSelect(callback) {
  callbacks.onUserSelect = callback;
}

/**
 * Set up user event delegation
 */
function setupUserEvents() {
  if (elements.usersList) {
    delegate(elements.usersList, 'click', '.user-btn', function(event) {
      const userId = this.getAttribute('data-user-id');
      if (userId && callbacks.onUserSelect) {
        callbacks.onUserSelect(userId);
      }
    });
  }
}

/**
 * Initialize users section
 * @param {Object} options - Configuration
 */
function initUsers(options = {}) {
  initElements();

  if (options.onUserSelect) onUserSelect(options.onUserSelect);

  setupUserEvents();
}

export {
  initUsers,
  renderUsers
};
