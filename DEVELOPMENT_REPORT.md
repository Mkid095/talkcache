# Talk Cache - Development Report

**Course**: CS551S Web Development
**University**: University of Aberdeen
**Academic Year**: 2024-2025

---

## 1. Project Overview

Talk Cache is a real-time chat application that allows multiple users to communicate with each other instantly. Users can join different chat rooms to have group conversations or send private messages to specific individuals. The application remembers all messages, so when a user reconnects, they can see the conversation history.

The application was built using Node.js for the server-side and vanilla JavaScript for the client-side. This means we didn't use any complex frameworks like React or Angular - instead, we used pure JavaScript to show understanding of the fundamentals. For real-time communication, we used Socket.IO, which is a library that enables instant two-way communication between the server and the browser.

---

## 2. Core Features and How They Work

### 2.1 Real-Time Messaging

The most important feature of Talk Cache is real-time messaging. When a user sends a message, it instantly appears on the screens of all other users in the same room or conversation. This is achieved through WebSocket technology, which keeps a persistent connection open between the browser and the server. Unlike traditional web requests where the browser asks for information and waits for a response, WebSocket allows both sides to send messages at any time.

When a user types a message and presses send, the message travels through several steps. First, the application checks if the user is in a private conversation or a public room. Then it sends the message to the server with information about who sent it and where it should go. The server receives this message, saves it to a file so it isn't lost, and then broadcasts it to all the users who should see it. Each user's browser receives the message and displays it on their screen immediately.

### 2.2 Multiple Chat Rooms

Users can create and join different chat rooms. Each room is like a separate conversation space - messages sent in one room only appear to users who have joined that room. This is useful for organizing discussions by topic or for groups who want their own private space.

When a user creates a new room, the server saves it to a file so that room continues to exist even after all users leave. When users join a room, the server sends them all the previous messages that were sent in that room, so they can catch up on the conversation. The room selection is handled through a sidebar on desktop and a modal popup on mobile devices.

### 2.3 Private Messaging

Private messaging allows two users to have a one-on-one conversation that other users cannot see. This is completely separate from the room-based chat system. To start a private conversation, a user simply clicks on another user's name.

Private messages are visually distinct from room messages. While room messages appear with a white background and a colored border, private messages use solid color backgrounds. Messages sent by the current user appear with a blue background, while messages received from others appear with an orange background. This clear visual distinction helps users immediately understand what type of conversation they are viewing.

### 2.4 User Authentication

When users first open the application, they see a login screen where they enter a username and password. New users are automatically registered when they first join - there's no separate registration process. If a user returns with the same username, the application checks their password.

The application remembers users who have successfully logged in. When a user returns to the application, they are automatically logged in without having to enter their credentials again. This is done by storing their information in the browser's local storage, which is a simple way to keep data between sessions.

If a user enters a username that already exists but provides the wrong password, the application shows a specific error message explaining that the username is taken and suggesting they may have entered an incorrect password. This helpful feedback prevents confusion about why login failed.

### 2.5 Message Persistence

All messages are saved to files on the server. This means that if the server restarts or if all users disconnect and later return, the conversation history is still available. When a user joins a room or starts a private conversation, they immediately see all previous messages.

The persistence system uses simple JSON files, which are text files that store data in a structured format. One file stores all messages, another stores registered users, and a third stores available rooms. This approach was chosen because it's simple and doesn't require setting up a database, making the application easier to understand and deploy.

---

## 3. User Interface Design Decisions

### 3.1 Overall Layout

The application uses a two-column layout on desktop devices. The left side shows a sidebar containing the application branding, a list of available rooms, and a list of currently connected users. The right side is the main chat area where messages are displayed and where users can type new messages. This layout follows familiar patterns from other chat applications like Discord and Slack, making it intuitive for new users.

On mobile devices, this layout changes completely because there isn't enough horizontal space for two columns. The sidebar is hidden and replaced with a bottom navigation bar. This mobile navigation bar contains three buttons: Rooms, Users, and Logout. The Rooms button is positioned in the center and made larger than the others because it's the most frequently used feature.

### 3.2 Room Background Colors

Each chat room has its own subtle background color, which helps users visually distinguish between different rooms. The colors are generated automatically based on the room name using a mathematical formula called a hash function. This means that the same room name always gets the same color, keeping the experience consistent.

The background colors are intentionally very subtle, with opacity set to around 18-22%. This was an important design decision - initially, the colors were much brighter, but this made the text harder to read and felt "too loud." After several rounds of adjustment, we settled on very soft tints that add personality without interfering with readability.

### 3.3 User Color Coding

Each user is assigned a consistent color based on their username. This is done using the same hash function approach used for room colors. When a user sees messages from the same person across different sessions or after refreshing the page, that person's messages always have the same color border. This makes it easy to identify who is speaking in a conversation.

There are fifteen different colors in the palette, and each user gets one of these colors permanently. This small number was chosen because it provides enough variety to distinguish users while keeping the interface from looking chaotic.

### 3.4 Toast Notifications

Instead of using browser alert boxes, which interrupt the user's experience and look outdated, we implemented a custom notification system called "toast" notifications. These are small messages that appear in the corner of the screen and automatically disappear after a few seconds.

Toast notifications are used for everything from error messages to success confirmations. On desktop, they appear in the top-right corner. On mobile, they appear just below the header to remain visible without obstructing the chat area. Different colors are used to indicate the type of notification - red for errors, green for success, and yellow for warnings.

The decision to use toast notifications instead of alerts makes the application feel more modern and professional. Alert boxes block all interaction until dismissed, which is frustrating for users. Toast notifications allow users to continue using the application while still receiving important feedback.

### 3.5 Mobile-Specific Design Choices

The mobile version of the application received special attention because many users access chat applications primarily on their phones. Several design decisions were made specifically for mobile:

The mobile header displays the application name and a small logo to remind users where they are. This branding is important because the sidebar with its branding is hidden on mobile. The mobile navigation bar is fixed to the bottom of the screen, making it easily reachable with thumbs - this follows standard mobile application patterns where navigation is at the bottom rather than the top.

The Rooms button in the mobile navigation is larger and positioned centrally because it's the primary action users perform. This visual hierarchy guides users to the most important feature. When users tap the Rooms or Users buttons on mobile, a slide-up modal appears showing the options rather than using a dropdown, which is easier to use on touch screens.

---

## 4. Technical Architecture

### 4.1 State Management

The application uses a centralized state management system. This means there's a single module responsible for storing and managing all the application's data - things like the current user's name, the list of messages, who's in the current conversation, and so on. Other parts of the application ask this state module for information when they need it, rather than each part keeping its own copy of the data.

This approach prevents bugs where different parts of the application show different information. For example, when a user clicks on another user's name to start a private conversation, the state is updated in one place, and all the different parts of the user interface that need to know about the private conversation check this single source of truth.

### 4.2 Client-Side Routing

One of the more advanced features we implemented is client-side routing. In a traditional website, when you navigate to a different page, the browser sends a request to the server and loads a completely new page. In Talk Cache, we handle navigation within the browser using JavaScript.

This is why refreshing the page doesn't return you to the login screen every time. The application keeps track of whether you're logged in and what screen you should see. If you're on the chat screen and refresh the page, the router checks your saved credentials, confirms you're logged in, and keeps you on the chat screen. This makes the application feel smoother and more like a native application.

The router also maintains the URL in the browser address bar. When you're logged out, the URL shows "/login", and when you're logged in, it shows "/chat". This allows users to use the browser's back and forward buttons, and it means that bookmarking a specific state works correctly.

### 4.3 Modular File Structure

A significant amount of effort went into organizing the code into small, focused files. Instead of having large files with hundreds of lines of code, we split the application into many small files, each responsible for one specific feature. For example, socket connection management is in one file, socket event handling in another, and socket API functions in a third. Similarly, the chat interface is split into separate files for colors, messages, and input handling.

This modular approach makes the code easier to understand and maintain. When you need to fix a bug or add a feature, you only need to look at the small file related to that feature rather than searching through hundreds of lines of unrelated code. All files are kept under 200 lines to ensure they remain manageable for students reading the code.

The file structure is feature-based rather than type-based. This means that files are grouped by what they do rather than what kind of file they are. For example, all socket-related files are in a socket folder, all user interface files are in a ui folder, and files that handle user actions are in a handlers folder. This makes it easy to find the code you're looking for based on the feature you want to work on.

### 4.4 Event-Driven Architecture

The application uses an event-driven architecture, particularly for real-time communication. Instead of the browser constantly asking the server "are there any new messages?", the server sends messages to the browser whenever something happens.

When a user sends a message, the server emits an event that all connected users receive. Each user's browser has event listeners set up that run specific code when each type of event occurs. This is much more efficient than constantly checking for updates and allows for truly instant communication.

---

## 5. Responsiveness Implementation

### 5.1 Desktop to Mobile Adaptation

The application was designed to work well on devices ranging from desktop computers to mobile phones. This is achieved through CSS media queries, which allow different styles to be applied based on the screen size.

On screens larger than 768 pixels wide, the application shows the two-column layout with the sidebar visible on the left. On smaller screens, the sidebar is hidden and the bottom navigation bar appears instead. The breakpoint at 768 pixels was chosen because it's a common width for tablets in portrait mode - this means tablet users see the mobile layout but with slightly more space.

### 5.2 Touch-Friendly Design

On mobile devices, all interactive elements were sized to be easily tappable. Buttons have a minimum height of 44 pixels, which is the recommended size for touch targets according to mobile design guidelines. This prevents users from accidentally tapping the wrong button or missing when they try to tap something.

The room and user selection modals on mobile use large touch targets and plenty of spacing. This makes it easy to select the right option even on small screens where precision can be difficult. The bottom navigation bar is fixed to the bottom of the screen so it's always within easy reach of the user's thumbs.

### 5.3 Flexible Layouts

CSS Flexbox is used for all the major layouts in the application. Flexbox is a modern layout system that makes it easy to create flexible designs that adapt to different screen sizes. For example, the message list uses Flexbox to arrange messages vertically while allowing them to expand horizontally to fill available space.

The sidebar also uses Flexbox to distribute space between the rooms list and the users list. This ensures that both sections get appropriate space regardless of the screen height. On shorter screens, both lists can scroll independently, which means users aren't limited in how many rooms or users they can see.

---

## 6. Design Decisions and Rationale

### 6.1 Why Vanilla JavaScript Instead of Frameworks

The decision to use vanilla JavaScript instead of popular frameworks like React or Vue was intentional. This is a coursework project for a web development course, and using pure JavaScript demonstrates understanding of fundamental concepts that frameworks often hide behind abstractions.

Without a framework, every feature must be implemented from scratch. This includes things like routing, state management, and DOM manipulation. While this requires more work, it provides deeper learning opportunities. The modular architecture we implemented shows that it's possible to write well-organized, maintainable code even without a framework's opinionated structure.

### 6.2 Why JSON File Storage

For data persistence, we chose to use JSON files rather than a traditional database like MongoDB or MySQL. This decision was driven by simplicity and the educational nature of the project. JSON files are easy to understand - you can open them in a text editor and see exactly what data is being stored.

Database systems introduce complexity in terms of setup, configuration, and connection management. For an application of this scale, a database would be overkill. JSON files are sufficient for storing messages, users, and rooms, and they make the application easier to deploy. Anyone with Node.js installed can run the application without needing to set up a database server.

Of course, for a production application with many users, a proper database would be necessary. The README file acknowledges this and suggests database integration as a future extension.

### 6.3 Why Socket.IO

Socket.IO was chosen for real-time communication because it provides a reliable abstraction over WebSockets. Raw WebSockets can be tricky to work with because connection management, reconnection logic, and fallback to alternative transport methods must all be handled manually.

Socket.IO handles all these details automatically. If a user's internet connection drops temporarily, Socket.IO automatically attempts to reconnect. If a browser doesn't support WebSockets, Socket.IO falls back to other technologies that achieve the same result. This reliability is important for a chat application where users expect their connection to work seamlessly.

### 6.4 Toast Notification Design

The toast notification system was custom-built rather than using a library. This was done to have complete control over the appearance and behavior of notifications. The design keeps notifications small and unobtrusive, with just a close button and the message text. Animations make them slide in smoothly from the side of the screen.

On desktop, notifications appear in the top-right corner because this is where users expect to see them based on conventions from desktop applications. On mobile, placing them below the header ensures they're visible without being obscured by the thumbs or interfering with the chat interface.

### 6.5 Color Scheme Decisions

The color scheme uses professional, muted tones rather than bright primary colors. The primary color is a deep blue (#0a4179), which conveys trust and professionalism. The secondary color is orange (#f97316), used for received private messages to create visual contrast with sent messages.

Background colors for rooms use very low opacity to avoid dominating the interface. The goal was to add visual interest and help distinguish rooms without making the text hard to read. Several rounds of adjustment were needed to find the right balance - early versions had much higher opacity that made the text difficult to read.

### 6.6 Private Chat Visual Distinction

Private messages use solid backgrounds while room messages use transparent backgrounds with colored borders. This distinction was intentional to help users immediately recognize what type of conversation they're viewing.

When a user switches from a room to a private conversation, the visual change is immediately apparent. The solid backgrounds make private messages feel more personal and direct, while the lighter room messages feel more like a group conversation. This subtle visual design choice improves the user experience by providing clear context.

---

## 7. Challenges Faced and Solutions

### 7.1 State Persistence Across Page Refreshes

One of the biggest challenges was ensuring that when a user refreshed the page, they remained logged in and could continue their conversation. Initially, every refresh returned the user to the login screen because the application didn't remember the login state.

The solution involved multiple pieces working together. First, user credentials are stored in the browser's localStorage, which persists across page refreshes. Second, a client-side router was implemented that checks this storage on page load and automatically authenticates the user if credentials are present. Third, the URL is maintained - users on the chat screen stay at the /chat URL, which the router recognizes as requiring authentication.

### 7.2 Private Messaging Implementation

Getting private messaging to work correctly was more complex than anticipated. The initial implementation queried the DOM to find the currently selected user, but this approach was fragile and didn't always work correctly.

The solution was to rely entirely on the centralized state management system. When a user is selected for a private conversation, this information is stored in the state module. When sending a message, the handler checks the state to determine whether it's a private or room message. This approach is more reliable because state changes can be tested and verified, whereas DOM queries can fail if the interface changes.

### 7.3 File Size Management

As the application grew, some files became quite large. The main JavaScript file exceeded 400 lines, as did the chat and sidebar interface files. Long files are difficult to navigate and understand, especially for students reviewing the code.

The solution was to refactor the code into smaller modules. The main file was split into handler modules for login, navigation, and messaging. The chat interface was split into separate files for colors, messages, and input. The sidebar was split into rooms, users, and colors. The socket client was split into connection, events, and API. After this refactoring, no single file exceeds 200 lines, making the codebase much more approachable.

### 7.4 Balancing Visual Appeal and Readability

Finding the right balance for background colors required multiple iterations. Initial colors were too faded and didn't provide enough distinction between rooms. After increasing opacity, they became "too shouting" and distracted from the actual messages.

The solution was to carefully tune the opacity levels to around 18-22%. This provides enough color to distinguish rooms while maintaining excellent text readability. The difference between "too faded" and "too shouting" was surprisingly narrow, requiring small adjustments and testing.

---

## 8. What I Learned

Working on Talk Cache significantly improved my understanding of several aspects of web development:

Understanding Socket.IO and real-time communication was enlightening. Seeing how events can be emitted from either the client or server, and how event listeners can react to these events, made event-driven architecture concrete rather than abstract. The way that Socket.IO handles reconnection automatically showed the value of using well-designed libraries.

State management became much clearer through building this application. I learned why keeping state in one place is so important - early versions had state scattered across different modules, which caused bugs where different parts of the interface showed conflicting information. Centralizing state solved these problems and made the code more predictable.

CSS architecture was another area of learning. Using CSS variables for colors, spacing, and other values made it easy to maintain visual consistency and make global changes. Organizing CSS into separate files based on components (login, sidebar, chat, etc.) made the styles much easier to find and modify.

Responsive design principles became practical knowledge rather than theory. Understanding how to use Flexbox, media queries, and relative units to create layouts that work on any screen size is valuable. I also learned that mobile-first thinking leads to better designs - starting with the constraints of mobile devices and expanding for desktop often works better than the reverse.

Finally, modular programming and code organization skills improved significantly. Breaking large files into smaller, focused modules while maintaining clear relationships between them is an important skill. The project demonstrated that good code organization isn't about following rules blindly - it's about creating a structure that makes the code easy to understand, navigate, and modify.

---

## 9. Future Improvements

If continuing work on this project, several areas could be enhanced:

The password system uses a simple encryption method suitable for an educational project but not secure enough for production. Implementing proper password hashing with bcrypt would be a significant security improvement. Similarly, adding JWT tokens for authentication would provide better session management.

The current JSON file storage doesn't scale well. For a production application, integrating a proper database like MongoDB or PostgreSQL would allow for better performance, data integrity, and query capabilities. File-based storage works fine for a demo but would become slow with many messages or users.

User experience could be enhanced with features like typing indicators, message read receipts, message reactions, and the ability to edit or delete messages. These are common expectations in modern chat applications and would make Talk Cache feel more complete.

From a code perspective, implementing automated tests would ensure that bugs are caught early and that new features don't break existing functionality. This is a practice that becomes increasingly important as projects grow in complexity.

---

## 10. Conclusion

Talk Cache demonstrates that it's possible to build a functional, well-architected real-time application using only fundamental web technologies. The modular code structure, responsive design, and thoughtful user interface show that vanilla JavaScript is sufficient for building modern web applications when organized properly.

The decisions made throughout development - from using Socket.IO for real-time communication to implementing client-side routing for state persistence - were driven by both technical requirements and the educational goals of the project. The result is an application that not only works well but also serves as a learning resource for understanding web development fundamentals.

This project represents significant learning in areas including real-time communication, state management, responsive design, and code organization. The experience of building Talk Cache from concept to a working application has been valuable in understanding both the theoretical and practical aspects of modern web development.
