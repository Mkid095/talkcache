/**
 * MESSAGE HANDLER
 * Handles sending messages
 * File: frontend/js/handlers/message-handler.js
 */

import {
  getPrivateRecipient,
  getCurrentRoom
} from '../state.js';

import {
  sendMessage,
  sendPrivateMessage
} from '../socket-client.js';

/**
 * Handle send message
 * @param {string} messageText - Message text
 */
function handleSendMessage(messageText) {
  const privateRecipient = getPrivateRecipient();

  if (privateRecipient) {
    // Send private message
    console.log('[App] Sending private message to:', privateRecipient.id);
    sendPrivateMessage(privateRecipient.id, messageText);
  } else {
    // Send room message - only if a room is selected
    const room = getCurrentRoom();
    if (!room) {
      console.warn('[App] No room selected - cannot send message');
      // Optionally show a toast notification here
      return;
    }
    console.log('[App] Sending room message to:', room);
    sendMessage(room, messageText);
  }
}

export {
  handleSendMessage
};
