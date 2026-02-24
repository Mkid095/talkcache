# Real-Time Chat Application

## Project Overview
This is a real-time chat application built using Node.js, Express, Socket.IO, and React. It supports live public chat, multiple rooms, private messaging, and message persistence. The frontend is styled with Tailwind CSS for a modern, responsive layout.

### Features
- **Live Public Chat:** Broadcast messages to all users in a room.
- **Multiple Rooms:** Create and join different chat rooms to organize conversations.
- **Private Messaging:** Send direct messages to specific users privately.
- **Message Persistence:** Chat history is saved to a local JSON file and loaded when users join.
- **Responsive UI:** Built with Flexbox/Grid and Tailwind CSS to work on various screen sizes.

## Setup and Installation

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation Steps
1. Clone or download the repository.
2. Install the dependencies by running:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. The server will start on `http://localhost:3000`.

## Usage and Testing

### Basic Usage
1. Open your browser and navigate to `http://localhost:3000`.
2. Enter a username to join the chat.
3. You will be placed in the `general` room by default.
4. Type a message in the input box at the bottom and press Enter or click the Send button.

### Testing Rooms
1. In the left sidebar, under "Rooms", type a new room name and click the `+` button.
2. Click on the new room to join it.
3. Open a second browser window (or an incognito window) and navigate to `http://localhost:3000`.
4. Join with a different username.
5. Join the same room and verify that messages are isolated to that room.

### Testing Private Messaging
1. With two different users connected, look at the "Online Users" list in the sidebar.
2. Click on the other user's name to start a private chat.
3. Send a message. It will appear with a "Private" badge.
4. Verify that the message is only visible to the sender and the recipient, and not in any public rooms.

### Testing Persistence
1. Send a few messages in a room.
2. Stop the server (`Ctrl+C` in the terminal).
3. Restart the server (`npm run dev`).
4. Refresh the browser and join with a username.
5. Verify that the previous messages are loaded and displayed.
