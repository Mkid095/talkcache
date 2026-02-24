/**
 * TOAST NOTIFICATION SYSTEM
 * Simple notification system
 * File: frontend/js/utils/toast.js
 */

let container = null;
const activeToasts = new Set();

/**
 * Initialize the toast container
 */
function initContainer() {
  if (container) return;
  container = document.createElement('div');
  container.className = 'toast-container';
  document.body.appendChild(container);
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Create a toast notification
 * @param {string} message - Message to display
 * @param {string} type - 'error' | 'success' | 'warning' | 'info'
 * @param {number} duration - Auto-dismiss time in ms
 */
function showToast(message, type = 'info', duration = 4000) {
  initContainer();

  const toastEl = document.createElement('div');
  toastEl.className = `toast toast-${type}`;
  toastEl.setAttribute('role', 'alert');

  toastEl.innerHTML = `
    <div class="toast-content">
      <p class="toast-message">${escapeHtml(message)}</p>
    </div>
    <button class="toast-close" aria-label="Close">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  `;

  const closeBtn = toastEl.querySelector('.toast-close');
  const close = () => {
    toastEl.classList.add('toast-exit');
    setTimeout(() => {
      if (toastEl.parentNode === container) {
        container.removeChild(toastEl);
      }
      activeToasts.delete(toastEl);
    }, 250);
  };

  closeBtn.addEventListener('click', close);

  container.appendChild(toastEl);
  activeToasts.add(toastEl);

  if (duration > 0) {
    setTimeout(close, duration);
  }
}

/**
 * Convenience functions
 */
function showError(message) {
  showToast(message, 'error');
}

function showSuccess(message) {
  showToast(message, 'success');
}

function showWarning(message) {
  showToast(message, 'warning');
}

function showInfo(message) {
  showToast(message, 'info');
}

export {
  showToast,
  showError,
  showSuccess,
  showWarning,
  showInfo
};
