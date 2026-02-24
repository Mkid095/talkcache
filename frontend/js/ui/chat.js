/**
 * CHAT AREA
 * Main chat module that coordinates all chat functionality
 * File: frontend/js/ui/chat.js
 */

import { on } from '../utils/helpers.js';
import {
  getFilteredMessages,
  getCurrentRoom,
  getPrivateRecipient
} from '../state.js';

import {
  updateRoomBackground
} from './chat/chat-colors.js';

import {
  initElements as initMessagesElements,
  renderMessages,
  addMessage,
  scrollToBottom,
  handleScroll
} from './chat/chat-messages.js';

import {
  initChatInput,
  updateInputPlaceholder
} from './chat/chat-input.js';

let elements = {};
let callbacks = {};

/**
 * Initialize all chat elements
 */
function initElements() {
  elements = {
    messagesContainer: document.getElementById('messages-container')
  };

  // Initialize sub-modules
  initMessagesElements();
}

/**
 * Set up the chat area
 * @param {Object} options - Configuration
 */
function initChat(options = {}) {
  initElements();

  // Register callback
  if (options.onSendMessage) {
    callbacks.onSendMessage = options.onSendMessage;
  }

  // Initialize input
  initChatInput({
    onSendMessage: options.onSendMessage
  });

  // Scroll handler
  if (elements.messagesContainer) {
    on(elements.messagesContainer, 'scroll', handleScroll);
  }

  console.log('[Chat] Ready');
}

// Export all functions
export {
  initChat,
  renderMessages,
  addMessage,
  scrollToBottom,
  updateInputPlaceholder,
  updateRoomBackground
};
