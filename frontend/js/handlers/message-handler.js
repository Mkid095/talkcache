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
    // Send room message
    const room = getCurrentRoom() || 'general';
    console.log('[App] Sending room message to:', room);
    sendMessage(room, messageText);
  }
}

export {
  handleSendMessage
};
