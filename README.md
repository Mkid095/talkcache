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
- **User authentication** with username/password verification and auto-registration
- **Message persistence** using JSON file storage
- **Auto-login** functionality for returning users
- **Responsive design** with mobile-friendly bottom navigation
- **User color coding** for visual identification based on username hash
- **Room-specific background colors** with subtle gradients
- **Toast notifications** for user feedback instead of browser alerts

---

## Features Implemented

### Core Chat Features
- **Public Messaging**: Send messages to all users in a room
- **Private Messaging**: Direct one-to-one conversations with solid color design
- **Multiple Rooms**: Create and switch between different chat rooms
- **Message History**: All messages persist and load on reconnect

### User Features
- **Authentication**: Username and password required to join
- **Auto-Registration**: New users are automatically registered
- **Auto-Login**: Returning users are automatically logged in from localStorage
- **User Colors**: Each user gets a consistent color (15-color palette)
- **Online Users List**: See who's currently connected
- **Clear Error Messages**: Specific feedback like "A user with username 'xxx' already exists. You may have entered the wrong password."

### UI/UX Features
- **Responsive Design**: Works on desktop and mobile devices
- **Mobile Navigation**: Bottom bar with prominent center Rooms button
- **Mobile Header**: Brand display with logo and username
- **Slide-up Modals**: Mobile-optimized room and user selection
- **Toast Notifications**: Elegant in-app notifications (no alerts)
- **Visual Feedback**: Active states, loading indicators
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

### Sending Messages

1. **Public Messages**: Type in the input box and press Enter or click Send
2. **Private Messages**:
   - Desktop: Click on a user's name in the sidebar
   - Mobile: Tap "Users" button, then select a user
3. **Switch Rooms**:
   - Desktop: Click on a room name in the sidebar
   - Mobile: Tap "Rooms" button (center) and select a room

### Creating Rooms

1. **Desktop**: Type room name in "New room..." input and click +
2. **Mobile**: Tap "Rooms" button, enter name, and tap create button

### Logging Out

- Desktop: Click the logout icon in the sidebar header
- Mobile: Tap "Logout" button on the bottom navigation

### Page Refresh Behavior

- When logged in: Refreshing stays on `/chat` and maintains state
- When logged out: Refreshing shows login screen
- Auto-login: Saved credentials automatically reconnect to server

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
4. **Feature-Based File Organization**: Files grouped by functionality

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
│   │   └── rooms.json            # Available rooms
│   └── socket/
│       ├── handlers.js           # Socket event handlers
│       ├── socket-connection.js # Socket connection management
│       ├── socket-events.js      # Event listener setup
│       └── socket-api.js         # API functions for server communication
│
├── frontend/
│   ├── index.html                # Main HTML file
│   ├── css/
│   │   ├── main.css              # Global styles and CSS variables
│   │   ├── login.css             # Login screen styles
│   │   ├── sidebar.css           # Sidebar component styles
│   │   ├── chat-layout.css       # Chat area layout structure
│   │   ├── chat-messages.css     # Message display styles
│   │   ├── chat-input.css        # Message input styles
│   │   ├── mobile-nav.css        # Mobile navigation styles
│   │   └── toast.css             # Toast notification styles
│   │
│   └── js/
│       ├── main.js                # App entry point and coordination
│       ├── state.js               # State management
│       ├── socket-client.js      # Socket.IO wrapper (exports socket modules)
│       ├── router.js              # Client-side routing for state persistence
│       │
│       ├── utils/
│       │   ├── helpers.js         # Utility functions (DOM, validation, formatting)
│       │   └── toast.js           # Toast notification system
│       │
│       ├── socket/
│       │   ├── socket-connection.js  # Socket connection
│       │   ├── socket-events.js     # Event handling
│       │   └── socket-api.js        # API functions
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
│           ├── mobile-nav.js       # Mobile navigation logic
│           │
│           ├── chat/
│           │   ├── chat-colors.js    # Room color assignments
│           │   ├── chat-messages.js  # Message rendering
│           │   └── chat-input.js     # Input handling
│           │
│           └── sidebar/
│               ├── sidebar-rooms.js  # Rooms list logic
│               ├── sidebar-users.js  # Users list logic
│               └── sidebar-colors.js # Color utilities
│
├── package.json
└── README.md
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
| Clear message distinction | Visual separation between messages |

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
| Clear interface | Room list with active indicators |
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

See [Development Notes](#development-notes) section below.

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
- `sidebar.js` → `sidebar/` folder (rooms, users, colors)
- `main.js` → `handlers/` folder (login, navigation, message)

All files are under 200 lines, making the codebase student-friendly.

#### 4. State Persistence with Routing
Client-side routing maintains login state across refreshes:
- `/login` route - Shows login screen
- `/chat` route - Shows chat interface (requires authentication)
- localStorage stores credentials for auto-login
- Router checks credentials on page load and restores state

#### 5. Toast Notification System
Replaced browser alerts with elegant toast notifications:
- Fixed positioning (top-right on desktop, below header on mobile)
- Auto-dismiss after 4 seconds
- Different styles for error (red), success (green), warning (yellow)
- Smooth slide-in/slide-out animations

### Challenges and Solutions

#### Challenge 1: State Persistence Across Refresh
**Problem**: Page refresh always returned to login screen.

**Solution**: Implemented client-side router that:
- Checks localStorage for saved credentials
- Maintains `/chat` or `/login` route
- Restores state before rendering UI
- Auto-authenticates with server on reconnect

#### Challenge 2: Large File Management
**Problem**: Some JavaScript files exceeded 400 lines, making them hard to navigate.

**Solution**: Split into feature-based modules:
- Created subfolders for related functionality
- Each file handles one specific feature
- Main coordinator files import from submodules
- All files are now under 200 lines

#### Challenge 3: Private Message Visual Distinction
**Problem**: Private messages needed unique appearance but weren't distinct enough.

**Solution**: Implemented solid color backgrounds:
- Sent messages: Solid blue (#0a4179)
- Received messages: Solid orange (#f97316)
- Different from room messages (white with colored border)
- Professional appearance with good contrast

#### Challenge 4: Background Color Contrast
**Problem**: Initial colors were too bright ("shouting") and distracted from messages.

**Solution**: Reduced opacity from 35% to 18-22%:
- Colors are now subtle tints that add personality
- Text remains highly readable
- Professional appearance maintained

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

### Personal Reflection

This project significantly enhanced understanding of:
- **Socket.IO**: Real-time communication patterns and event-driven architecture
- **State Management**: Keeping client and server state synchronized
- **CSS Architecture**: CSS variables and feature-based file organization
- **Error Handling**: Graceful degradation with user feedback
- **Responsive Design**: Mobile-first design that scales to desktop
- **Modular Programming**: Breaking large files into manageable modules

The most interesting aspect was seeing how real-time communication works under the Socket.IO API, and how separating concerns into modules makes code much more maintainable.

---

## Known Issues & Limitations

1. **Security**: Passwords use simple encryption, not proper hashing
2. **Scalability**: JSON file storage doesn't scale well for large datasets
3. **Session Management**: No automatic session timeout

---

## Testing Guide

1. **Open multiple browser tabs** to simulate different users
2. **Test room isolation** by sending messages in different rooms
3. **Test private messaging** by clicking on different users
4. **Test persistence** by restarting the server and checking history
5. **Test mobile view** using browser DevTools device emulation
6. **Test auto-login** by refreshing the page after logging in
7. **Test error messages** by entering wrong password for existing user

---

## Contact

For questions about this coursework:
- Dr Miles Everett: miles.everett@abdn.ac.uk
- Dr Debbie Meharg: debbie.meharg@abdn.ac.uk

---

**Course**: CS551S Web Development
**University**: University of Aberdeen
**Academic Year**: 2024-2025
