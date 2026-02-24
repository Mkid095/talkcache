/**
 * TALK CACHE - SERVER
 * Main server file for the chat application
 */

const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

// Import our modules
const { initDataStore } = require("./data/store");
const {
  handleJoin,
  handleJoinRoom,
  handleSendMessage,
  handlePrivateMessage,
  handleDisconnect,
  sendUsersList,
  handleCreateRoom
} = require("./socket/handlers");

// Server configuration
const PORT = 3000;

/**
 * Start the server
 */
async function startServer() {
  // Create data folder and messages file
  await initDataStore();

  // Create Express app
  const app = express();
  const httpServer = http.createServer(app);

  // Create Socket.IO server
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Serve static files from frontend folder
  app.use(express.static(__dirname + "/../frontend"));

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Handle client-side routing - serve index.html for all non-API routes
  app.get("*", (req, res) => {
    // Don't redirect socket.io requests
    if (req.url.startsWith("/socket.io/")) {
      return;
    }
    // Serve index.html for all routes (SPA routing)
    res.sendFile(path.resolve(__dirname, "../frontend/index.html"));
  });

  // Handle new socket connections
  io.on("connection", (socket) => {
    console.log(`New connection: ${socket.id}`);

    // Send current users to new connection
    sendUsersList(socket);

    // Register event handlers
    socket.on("join", (credentials) => {
      console.log(`[Server] Received join event:`, credentials);
      handleJoin(socket, io, credentials);
    });
    socket.on("join_room", (room) => handleJoinRoom(socket, room));
    socket.on("send_message", (data) => handleSendMessage(socket, io, data));
    socket.on("send_private_message", (data) => handlePrivateMessage(socket, io, data));
    socket.on("create_room", (roomName) => handleCreateRoom(socket, io, roomName));
    socket.on("disconnect", () => handleDisconnect(socket, io));
  });

  // Start listening
  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log("=".repeat(40));
    console.log("  TALK CACHE SERVER");
    console.log("=".repeat(40));
    console.log(`  Running on: http://localhost:${PORT}`);
    console.log("=".repeat(40));
  });
}

// Start the server
startServer().catch((error) => {
  console.error("Failed to start:", error);
  process.exit(1);
});
