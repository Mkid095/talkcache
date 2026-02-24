/**
 * HELPER FUNCTIONS
 * Useful functions used throughout the app
 */

// =============================================
// DOM HELPERS - Functions to work with HTML elements
// =============================================

/**
 * Get one element from the page
 * @param {string} selector - CSS selector like "#id" or ".class"
 * @returns {HTMLElement|null} The element or null
 */
function $(selector, parent = document) {
  return parent.querySelector(selector);
}

/**
 * Get multiple elements from the page
 * @param {string} selector - CSS selector
 * @returns {NodeList} List of elements
 */
function $$(selector, parent = document) {
  return parent.querySelectorAll(selector);
}

// =============================================
// EVENT HELPERS - Functions for user interactions
// =============================================

/**
 * Add an event listener to an element
 * @param {HTMLElement} element - The element
 * @param {string} event - Event name like "click"
 * @param {Function} handler - Function to run when event happens
 */
function on(element, event, handler) {
  if (!element) {
    console.error('[Helpers] on() called with null element for event:', event);
    return;
  }
  element.addEventListener(event, handler);
  console.log('[Helpers] Event listener attached:', event, 'to element:', element.tagName + (element.id ? '#' + element.id : ''));
}

/**
 * Event delegation - handle clicks on dynamically added elements
 * @param {HTMLElement} parent - Parent element
 * @param {string} event - Event name
 * @param {string} selector - CSS selector for target
 * @param {Function} handler - Function to run
 */
function delegate(parent, event, selector, handler) {
  on(parent, event, (e) => {
    const target = e.target.closest(selector);
    if (target && parent.contains(target)) {
      handler.call(target, e);
    }
  });
}

// =============================================
// STRING HELPERS
// =============================================

/**
 * Escape HTML to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// =============================================
// DATE/TIME HELPERS
// =============================================

/**
 * Format timestamp to readable time like "2:30 PM"
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {string} Formatted time
 */
function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// =============================================
// VALIDATION HELPERS
// =============================================

/**
 * Check if username is valid (1-50 characters)
 * @param {string} username - Username to check
 * @returns {boolean} True if valid
 */
function isValidUsername(username) {
  return typeof username === 'string' &&
         username.trim().length > 0 &&
         username.trim().length <= 50;
}

/**
 * Check if message is valid (1-1000 characters)
 * @param {string} message - Message to check
 * @returns {boolean} True if valid
 */
function isValidMessage(message) {
  return typeof message === 'string' &&
         message.trim().length > 0 &&
         message.trim().length <= 1000;
}

// Export all functions so other files can use them
export {
  $,
  $$,
  on,
  delegate,
  escapeHtml,
  formatTime,
  isValidUsername,
  isValidMessage
};
