/**
 * CHAT MESSAGES RENDERING
 * Handles displaying messages in the chat
 * File: frontend/js/ui/chat/chat-messages.js
 */

import { $ } from '../../utils/helpers.js';
import {
  getFilteredMessages,
  getSocketId
} from '../../state.js';
import { escapeHtml, formatTime } from '../../utils/helpers.js';
import { getUserColor } from './chat-colors.js';

// DOM elements
let elements = {};
let autoScroll = true;

/**
 * Get DOM element references
 */
function initElements() {
  elements = {
    messagesContainer: $('#messages-container'),
    messagesList: $('#messages-list'),
    emptyState: $('#empty-state')
  };
}

/**
 * Render all messages for current view
 */
function renderMessages() {
  const messages = getFilteredMessages();
  const list = elements.messagesList;
  const emptyState = elements.emptyState;

  if (!list) return;

  list.innerHTML = '';

  if (emptyState) {
    if (messages.length === 0) {
      emptyState.classList.remove('hidden');
    } else {
      emptyState.classList.add('hidden');
    }
  }

  let previousSenderId = null;

  messages.forEach((msg) => {
    const showName = previousSenderId !== msg.senderId;
    const messageElement = createMessageElement(msg, showName);
    list.appendChild(messageElement);
    previousSenderId = msg.senderId;
  });

  scrollToBottom();
}

/**
 * Create HTML for a single message
 * @param {Object} message - Message data
 * @param {boolean} showName - Show sender name?
 * @returns {HTMLElement} Message element
 */
function createMessageElement(message, showName = true) {
  const isMe = message.senderId === getSocketId();
  const isPrivate = message.isPrivate || false;
  const container = document.createElement('div');

  const classes = ['message'];
  if (isMe) classes.push('sent');
  else classes.push('received');
  if (isPrivate) classes.push('private');

  container.className = classes.join(' ');
  container.dataset.messageId = message.id;

  let senderColor = message.senderColor;
  if (!senderColor && message.senderName) {
    senderColor = getUserColor(message.senderName);
  }
  senderColor = senderColor || '#5cd387';

  let html = '';

  // Show sender name for received messages
  if (!isMe && (showName || isPrivate)) {
    html += `<span class="message-sender" style="color: ${senderColor}">${escapeHtml(message.senderName)}</span>`;
  }

  // Message bubble
  if (isPrivate) {
    html += `<div class="message-bubble">${escapeHtml(message.text)}</div>`;
  } else {
    const bubbleStyle = !isMe ? `border-color: ${senderColor}; box-shadow: 0 1px 2px ${senderColor}33;` : '';
    html += `<div class="message-bubble" style="${bubbleStyle}">${escapeHtml(message.text)}</div>`;
  }

  // Timestamp
  html += `<span class="message-time">${formatTime(message.timestamp)}</span>`;

  container.innerHTML = html;
  return container;
}

/**
 * Add a new message to the list
 * @param {Object} message - Message to add
 */
function addMessage(message) {
  const list = elements.messagesList;
  const emptyState = elements.emptyState;

  if (!list) return;

  if (emptyState) {
    emptyState.classList.add('hidden');
  }

  const lastMessage = list.lastElementChild;
  let showName = true;

  if (lastMessage) {
    const lastSenderId = lastMessage.dataset.senderId;
    showName = lastSenderId !== message.senderId;
  }

  const messageElement = createMessageElement(message, showName);
  messageElement.dataset.senderId = message.senderId;
  list.appendChild(messageElement);

  if (autoScroll) {
    scrollToBottom();
  }
}

/**
 * Scroll messages to bottom
 */
function scrollToBottom() {
  const container = elements.messagesContainer;
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

/**
 * Check if user is scrolled near bottom
 * @returns {boolean} True if near bottom
 */
function isNearBottom() {
  const container = elements.messagesContainer;
  if (!container) return true;

  const threshold = 50;
  return container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
}

/**
 * Update auto-scroll state
 */
function handleScroll() {
  autoScroll = isNearBottom();
}

export {
  initElements,
  renderMessages,
  addMessage,
  scrollToBottom,
  handleScroll
};
