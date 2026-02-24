/**
 * CHAT INPUT
 * Handles message input and sending
 * File: frontend/js/ui/chat/chat-input.js
 */

import { $, on } from '../../utils/helpers.js';
import { getCurrentRoom, getPrivateRecipient } from '../../state.js';

// DOM elements
let elements = {};
let callbacks = {};

/**
 * Get DOM element references
 */
function initElements() {
  elements = {
    messageForm: $('#message-form'),
    messageInput: $('#message-input'),
    sendBtn: $('#send-btn')
  };
}

/**
 * Get what user typed
 * @returns {string} Message text
 */
function getMessageInput() {
  return elements.messageInput?.value?.trim() || '';
}

/**
 * Clear the input
 */
function clearMessageInput() {
  if (elements.messageInput) {
    elements.messageInput.value = '';
  }
  updateSendButtonState();
}

/**
 * Focus on the input
 */
function focusMessageInput() {
  elements.messageInput?.focus();
}

/**
 * Update placeholder text
 * @param {string} room - Current room
 * @param {Object} recipient - Private chat recipient
 */
function updateInputPlaceholder(room, recipient = null) {
  if (!elements.messageInput) return;

  if (recipient) {
    elements.messageInput.placeholder = `Message ${recipient.name}...`;
  } else {
    elements.messageInput.placeholder = `Message #${room}...`;
  }
}

/**
 * Enable/disable send button
 */
function updateSendButtonState() {
  const message = getMessageInput();
  if (elements.sendBtn) {
    elements.sendBtn.disabled = !message;
  }
}

/**
 * Handle form submission
 */
function handleSendMessage() {
  return function(event) {
    event.preventDefault();

    const message = getMessageInput();

    if (!message) return;

    if (callbacks.onSendMessage) {
      callbacks.onSendMessage(message);
    }

    clearMessageInput();
  };
}

/**
 * Register callback for sending messages
 * @param {Function} callback - Function to call
 */
function onSendMessage(callback) {
  callbacks.onSendMessage = callback;
}

/**
 * Set up the chat input
 * @param {Object} options - Configuration
 */
function initChatInput(options = {}) {
  initElements();

  if (options.onSendMessage) {
    onSendMessage(options.onSendMessage);
  }

  if (elements.messageForm) {
    on(elements.messageForm, 'submit', handleSendMessage());
  }

  if (elements.messageInput) {
    on(elements.messageInput, 'input', updateSendButtonState);
  }

  updateSendButtonState();
}

export {
  initChatInput,
  getMessageInput,
  clearMessageInput,
  focusMessageInput,
  updateInputPlaceholder
};
