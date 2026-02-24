# Talk Cache - Real-Time Chat Application

## Coursework Submission for CS551S: Web Development

**University of Aberdeen** - Department of Computing Science

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features Implemented](#features-implemented)
3. [Installation & Setup](#installation--setup)
4. [Usage Guide](#usage-guide)
5. [Technical Architecture](#technical-architecture)
6. [Project Structure](#project-structure)
7. [Assignment Requirements Mapping](#assignment-requirements-mapping)
8. [Development Notes](#development-notes)

---

## Project Overview

**Talk Cache** is a real-time chat application built with Node.js, Express, and Socket.IO. It enables users to communicate in public chat rooms, send private messages, and persist chat history across sessions using a clean, modular architecture.

### Key Features
- **Real-time messaging** with instant delivery using WebSocket connections
- **Multiple chat rooms** with creation and isolation
- **Private messaging** between connected users
- **Unread message tracking** for both rooms and private conversations
- **User authentication** with username/password verification and auto-registration
- **Default "general" room** that users automatically join on login
- **Message persistence** using JSON file storage
- **Auto-login** functionality for returning users
- **Responsive design** with mobile-friendly bottom navigation
- **User color coding** for visual identification based on username hash
- **Room-specific background colors** with subtle gradients
- **Toast notifications** for user feedback instead of browser alerts
- **Mobile unread badges** showing message counts on rooms and users

---

## Features Implemented

### Core Chat Features
- **Public Messaging**: Send messages to all users in a room
- **Private Messaging**: Direct one-to-one conversations with solid color design
- **Multiple Rooms**: Create and switch between different chat rooms
- **Message History**: All messages persist and load on reconnect
- **Unread Tracking**: Visual badges showing unread message counts for rooms and private chats

### User Features
- **Authentication**: Username and password required to join
- **Auto-Registration**: New users are automatically registered
- **Auto-Login**: Returning users are automatically logged in from localStorage
- **Default Room**: Users automatically join the "general" room on login
- **User Colors**: Each user gets a consistent color (15-color palette)
- **Online Users List**: See who's currently connected
- **Clear Error Messages**: Specific feedback for login failures and errors

### UI/UX Features
- **Responsive Design**: Works on desktop and mobile devices
- **Mobile Navigation**: Bottom bar with prominent center Rooms button
- **Mobile Header**: Brand display with logo and username
- **Slide-up Modals**: Mobile-optimized room and user selection with unread badges
- **Toast Notifications**: Elegant in-app notifications (no alerts)
- **Visual Feedback**: Active states, loading indicators, unread badges
- **Professional Colors**: Subtle background gradients, solid private chat colors

---

## Installation & Setup

### Prerequisites

- **Node.js** (LTS version recommended) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- A modern web browser (Chrome, Firefox, Safari, Edge)

### Installation Steps

1. **Clone or download the project**
   ```bash
   cd talkcache
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

   Or directly:
   ```bash
   node backend/server.js
   ```

4. **Open in browser**
   - Navigate to: `http://localhost:3000`
   - Open multiple browser tabs/windows to test multiple users

---

## Usage Guide

### First Time Use

1. Open the application at `http://localhost:3000`
2. Enter a username (3-50 characters, alphanumeric)
3. Enter a password (1-50 characters)
4. Click "Join Chat"
   - New users will be automatically registered
   - Returning users will be verified
   - You will automatically join the "general" room

### Sending Messages

1. **Public Messages**: Type in the input box and press Enter or click Send
2. **Private Messages**:
   - Desktop: Click on a user's name in the sidebar
   - Mobile: Tap "Users" button, then select a user
   - Private messages show with solid colored backgrounds (blue sent, orange received)
3. **Switch Rooms**:
   - Desktop: Click on a room name in the sidebar
   - Mobile: Tap "Rooms" button (center) and select a room
   - Rooms with unread messages show orange badges

### Creating Rooms

1. **Desktop**: Type room name in "New room..." input and click +
2. **Mobile**: Tap "Rooms" button, enter name, and tap create button
3. New rooms are immediately available to all users

### Unread Messages

- **Room messages**: Orange badge shows count of unread messages per room
- **Private messages**: Orange badge shows count of unread private messages per user
- **Mobile navigation badge**: Total unread count shown on Users button
- Badges are cleared when you open the room or chat

### Logging Out

- Desktop: Click the logout icon in the sidebar header
- Mobile: Tap "Logout" button on the bottom navigation
- All unread counts are reset on logout

### Page Refresh Behavior

- When logged in: Refreshing stays on `/chat` and maintains state
- When logged out: Refreshing shows login screen
- Auto-login: Saved credentials automatically reconnect to server
- Chat history and state are preserved across refreshes

---

## Technical Architecture

### Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Backend | Node.js | JavaScript runtime |
| Server Framework | Express.js | HTTP server and middleware |
| Real-time Communication | Socket.IO | WebSocket wrapper for real-time events |
| Data Persistence | JSON Files | Simple file-based storage |
| Frontend | Vanilla JavaScript (ES6 Modules) | No framework dependencies |
| Styling | CSS3 (Flexbox) | Modern layout with CSS variables |

### Architecture Patterns

1. **Event-Driven Architecture**: Socket.IO for real-time bidirectional communication
2. **Module Pattern**: ES6 modules for clean code organization
3. **Separation of Concerns**: UI, state, networking, and handlers in separate modules
4. **Feature-Based File Organization**: Files grouped by functionality, all under 200 lines
5. **State Management**: Centralized state module for application state
6. **Client-Side Routing**: Browser History API for state persistence

### Data Flow

```
User Input -> UI Module -> Handler -> Socket Client -> Server -> Handler -> Data Store
                                                                              ↓
User ← UI Update ← State Update ← Socket Event ← Server Response ←
```

---

## Project Structure

```
talkcache/
├── backend/
│   ├── server.js                 # Main server entry point
│   ├── data/
│   │   ├── store.js              # Data persistence layer
│   │   ├── messages.json         # Stored messages
│   │   ├── users.json            # Registered users
│   │   └── rooms.json            # Available rooms (general is default)
│   └── socket/
│       ├── handlers.js           # Socket event handlers
│       └── index.js              # Socket connection and events
│
├── frontend/
│   ├── index.html                # Main HTML file
│   ├── components/               # HTML component fragments
│   │   ├── login-screen.html     # Login screen markup
│   │   ├── sidebar.html          # Sidebar markup
│   │   └── chat-area.html        # Chat area markup
│   ├── css/
│   │   ├── main.css              # Global styles and CSS variables
│   │   ├── login.css             # Login screen styles
│   │   ├── sidebar.css           # Sidebar component styles
│   │   ├── sidebar-lists.css     # Room/user list styles
│   │   ├── chat-layout.css       # Chat area layout structure
│   │   ├── chat-messages.css     # Message display styles
│   │   ├── chat-input.css        # Message input styles
│   │   ├── mobile-nav.css        # Mobile navigation styles
│   │   ├── mobile-rooms-modal.css   # Mobile rooms modal
│   │   ├── mobile-users-modal.css   # Mobile users modal
│   │   └── toast.css             # Toast notification styles
│   │
│   └── js/
│       ├── main.js                # App entry point and coordination
│       ├── state.js              # Centralized state management
│       ├── state-unread.js       # Unread message tracking module
│       ├── socket-client.js      # Socket.IO wrapper (exports socket modules)
│       ├── router.js             # Client-side routing for state persistence
│       ├── app-ui.js             # UI initialization coordinator
│       ├── app-socket-handlers.js # Socket event handlers
│       │
│       ├── utils/
│       │   ├── helpers.js        # Utility functions (DOM, validation, formatting)
│       │   ├── toast.js          # Toast notification system
│       │   └── scroll-tracker.js # Scroll-based read tracking
│       │
│       ├── socket/
│       │   ├── socket-connection.js  # Socket connection management
│       │   ├── socket-events.js     # Socket event listener setup
│       │   └── socket-api.js        # API functions for server communication
│       │
│       ├── handlers/
│       │   ├── login-handler.js     # Login flow handling
│       │   ├── navigation-handler.js # Room/user selection
│       │   └── message-handler.js   # Message sending logic
│       │
│       └── ui/
│           ├── login.js            # Login screen logic
│           ├── sidebar.js          # Sidebar coordinator
│           ├── chat.js             # Chat coordinator
│           │
│           ├── chat/
│           │   ├── chat-colors.js    # Room color assignments
│           │   ├── chat-messages.js  # Message rendering
│           │   └── chat-input.js     # Input handling
│           │
│           ├── sidebar/
│           │   ├── sidebar-rooms.js  # Rooms list logic
│           │   ├── sidebar-users.js  # Users list logic
│           │   ├── sidebar-rooms-form.js # Create room form
│           │   └── sidebar-colors.js # Color utilities
│           │
│           └── mobile/
│               ├── mobile-nav.js       # Mobile navigation coordinator
│               ├── mobile-rooms-modal.js  # Mobile rooms modal
│               └── mobile-users-modal.js  # Mobile users modal
│
├── package.json
├── README.md
└── REFLECTIVE_REPORT.md
```

---

## Assignment Requirements Mapping

### Task 1: Server Setup and Structure (10 marks) ✅

| Requirement | Implementation |
|-------------|----------------|
| Node.js project with npm | package.json with dependencies |
| Organized folder structure | Separate backend/frontend folders with feature-based organization |
| Express and Socket.IO installed | Listed in package.json |
| Starts without errors | Verified with testing |
| Listens on port 3000 | Configured in server.js |
| Error handling | Try/catch blocks in all async functions |

### Task 2: Real-Time Messaging (20 marks) ✅

| Requirement | Implementation |
|-------------|----------------|
| Submit messages from UI | Message form in chat interface |
| Broadcast to all clients | Socket.IO io.emit() |
| Dynamic updates | receive_message event handler |
| Empty message handling | Validation before sending |
| No crash on bad input | Input sanitization and length limits |
| Message list display | Messages render in scrollable container |
| Clear message distinction | Visual separation between messages with timestamps |

### Task 3: Modern HTML Layout (10 marks) ✅

| Requirement | Implementation |
|-------------|----------------|
| Flexbox layout | Flexbox for main layout |
| Responsive design | Media queries for mobile/tablet |
| Visible inputs | High contrast colors, clear labels |
| Proper spacing | CSS variables for consistent spacing |
| Color contrast | Subtle professional colors, WCAG compliant |
| Readable fonts | System font stack, proper sizing |

### Task 4: Code Quality and Comments (10 marks) ✅

| Requirement | Implementation |
|-------------|----------------|
| Logical file separation | Feature-based module structure with no files over 200 lines |
| Clear naming | Descriptive function and variable names |
| Inline comments | JSDoc-style comments throughout |
| Explanatory comments | "Why" documented, not just "what" |

### Task 5: Multiple Chat Rooms (10 marks) ✅

| Requirement | Implementation |
|-------------|----------------|
| Create new rooms | Create room form + socket handler + persistence |
| Join existing rooms | Room selection in sidebar/modal |
| Message isolation | Socket.IO rooms feature |
| Clear interface | Room list with active indicators and unread badges |
| Visual indication | Active room highlighting |

### Task 6: Message Persistence (10 marks) ✅

| Requirement | Implementation |
|-------------|----------------|
| Write to file | JSON file storage on each message |
| Load on start | initDataStore() loads history |
| Load on join | message_history event sends history |
| Error handling | Try/catch around file operations |

### Task 7: Private Messaging (10 marks) ✅

| Requirement | Implementation |
|-------------|----------------|
| Start private chat | Click on user to start DM |
| Message isolation | Private messages only to recipient |
| Visual distinction | Solid backgrounds (blue sent, orange received) |
| Unique presentation | Different from room messages |

### Task 8: README (10 marks) ✅

| Requirement | Implementation |
|-------------|----------------|
| Feature summary | Features section |
| Install/run steps | Detailed setup guide |
| Prerequisites | Node.js requirement documented |
| Usage instructions | Complete usage guide |
| Testing suggestions | Multiple browser tabs tip |

### Task 9: Reflective Report (10 marks) ✅

See [REFLECTIVE_REPORT.md](REFLECTIVE_REPORT.md) for detailed reflections.

---

## Development Notes

### Research Sources

During development, research was conducted using:

- **Google**: For understanding Socket.IO basics, Express setup, CSS Flexbox layouts
- **Stack Overflow**: For solving specific issues:
  - Socket.IO event handling patterns
  - CSS mobile responsiveness techniques
  - JSON file persistence in Node.js
  - Auto-login implementation with localStorage
  - Unread message tracking patterns
- **MDN Web Docs**: For JavaScript ES6 modules, fetch API, CSS properties
- **Socket.IO Documentation**: For understanding event emission and room management

### Key Implementation Decisions

#### 1. Simple Password Encryption
A basic encryption method for educational purposes:
```javascript
// Method: "Aber" + password + "deen"
function encryptPassword(password) {
  return "Aber" + password + "deen";
}
```
*Note: In production, use proper hashing like bcrypt.*

#### 2. Consistent Color Assignment
```javascript
// Hash-based color from username
function getUserColor(username) {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return USER_COLORS[Math.abs(hash) % USER_COLORS.length];
}
```

#### 3. Modular Architecture
Large files were split into smaller feature-based modules:
- `socket-client.js` → `socket/` folder (connection, events, api)
- `chat.js` → `chat/` folder (colors, messages, input)
- `sidebar.js` → `sidebar/` folder (rooms, users, colors, form)
- `main.js` → `handlers/` folder (login, navigation, message)
- `state.js` → `state-unread.js` for unread tracking

All files are under 200 lines, making the codebase student-friendly.

#### 4. State Persistence with Routing
Client-side routing maintains login state across refreshes:
- `/login` route - Shows login screen
- `/chat` route - Shows chat interface (requires authentication)
- localStorage stores credentials for auto-login
- Router checks credentials on page load and restores state

#### 5. Unread Message Tracking
Dedicated module (`state-unread.js`) handles unread counts:
- Private message unread: Tracked per user ID
- Room message unread: Tracked per room name
- Total unread count: Used for mobile badge
- Cleared when user opens the chat/room

#### 6. Default Room Behavior
New features for better UX:
- Users automatically join "general" room on login
- "general" room is always available (added if missing from server)
- Room appears in sidebar immediately when joined

#### 7. Socket Reconnection Handling
Robust connection management:
- `ensureConnected()` function to check and restore connection
- Automatic reconnection with retry logic
- Handlers re-attached on reconnection
- Graceful handling of disconnect/reconnect cycles

### Challenges and Solutions

#### Challenge 1: Import Path Issues After File Split
**Problem**: After splitting large files into modules, import paths became incorrect, causing MIME type errors and missing exports.

**Solution**: Systematically verified all import paths:
- Updated relative paths for moved modules (e.g., `mobile-nav.js` → `mobile/mobile-nav.js`)
- Fixed incorrect exports (e.g., `renderModalRooms` was exported from wrong module)
- Added missing imports (e.g., `renderUsers` in navigation-handler)

#### Challenge 2: State Persistence and Reconnection
**Problem**: After logout/disconnect, users couldn't log in again - socket references became stale.

**Solution**: Implemented `ensureConnected()` function that:
- Checks if socket exists and is connected
- Creates new socket if needed
- Reconnects existing socket if disconnected
- Properly clears state on disconnect

#### Challenge 3: Private Message Display
**Problem**: Sent private messages weren't visible to the sender. Only received messages showed.

**Solution**: Fixed the display logic in `onReceiveMessage`:
```javascript
const shouldDisplay = message.isPrivate
  ? (privateRecipient && (
      privateRecipient.id === message.senderId ||   // From recipient
      privateRecipient.id === message.recipientId   // To recipient (sent by me)
    ))
  : (message.room === currentRoom);
```

#### Challenge 4: Unread Count Accuracy
**Problem**: Unread counts were comparing socket IDs with usernames (different types).

**Solution**: Fixed comparison to use correct types:
```javascript
// Before (WRONG): message.senderId !== getUsername()
// After (CORRECT): message.senderId !== getSocketId()
```

#### Challenge 5: Mobile Unread Badges Not Showing
**Problem**: Room unread badges weren't rendering in mobile modal.

**Solution**: Added badge rendering to mobile rooms modal:
- Imported `getRoomUnread` function
- Added unread badge HTML to room buttons
- Created CSS for `.modal-room-unread-badge` with proper positioning
- Set `overflow: visible` on parent elements to prevent clipping

### Future Extensions

1. **Proper Authentication**
   - JWT (JSON Web Tokens) for secure authentication
   - bcrypt for password hashing
   - Session management with expiration

2. **Enhanced UI Features**
   - Typing indicators
   - Message read receipts
   - Message reactions
   - File/image sharing

3. **Database Integration**
   - Replace JSON files with MongoDB or PostgreSQL
   - Better query performance
   - Data migrations

4. **Advanced Features**
   - User profiles and avatars
   - Search functionality
   - Message editing and deletion
   - Moderation tools

---

## Known Issues & Limitations

1. **Security**: Passwords use simple encryption, not proper hashing
2. **Scalability**: JSON file storage doesn't scale well for large datasets
3. **Session Management**: No automatic session timeout

---

## Testing Guide

1. **Open multiple browser tabs** to simulate different users
2. **Test room isolation** by sending messages in different rooms
3. **Test private messaging** by clicking on different users (both directions)
4. **Test persistence** by restarting the server and checking history
5. **Test mobile view** using browser DevTools device emulation
6. **Test auto-login** by refreshing the page after logging in
7. **Test error messages** by entering wrong password for existing user
8. **Test unread badges** by sending messages to other rooms/users
9. **Test default room** by logging in and checking automatic "general" join
10. **Test reconnection** by stopping/starting the server while logged in

---

## Contact

For questions about this coursework:
- Dr Miles Everett: miles.everett@abdn.ac.uk
- Dr Debbie Meharg: debbie.meharg@abdn.ac.uk

---

**Course**: CS551S Web Development
**University**: University of Aberdeen
**Academic Year**: 2024-2025
