import express from "express";
import { createServer as createViteServer } from "vite";
import { createServer } from "http";
import { Server } from "socket.io";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "data");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");

// Define message types
interface ChatMessage {
  id: string;
  room: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  isPrivate: boolean;
  recipientId?: string;
}

// In-memory store for connected users
const connectedUsers = new Map<string, { id: string; name: string }>();

// Ensure data directory and messages file exist
async function initDataStore() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(MESSAGES_FILE);
    } catch {
      await fs.writeFile(MESSAGES_FILE, JSON.stringify([]), "utf-8");
    }
  } catch (error) {
    console.error("Error initializing data store:", error);
  }
}

// Load messages from file
async function loadMessages(): Promise<ChatMessage[]> {
  try {
    const data = await fs.readFile(MESSAGES_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading messages:", error);
    return [];
  }
}

// Save a new message to file
async function saveMessage(message: ChatMessage) {
  try {
    const messages = await loadMessages();
    messages.push(message);
    await fs.writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving message:", error);
  }
}

async function startServer() {
  await initDataStore();

  const app = express();
  const PORT = 3000;
  const httpServer = createServer(app);
  
  // Initialize Socket.IO
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Socket.IO event handlers
  io.on("connection", async (socket) => {
    console.log(`User connected: ${socket.id}`);
    
    // Send existing users to the newly connected client
    socket.emit("users_list", Array.from(connectedUsers.values()));

    // Handle user joining
    socket.on("join", async (username: unknown) => {
      if (typeof username !== 'string') return;
      const cleanName = username.trim();
      if (!cleanName || cleanName.length > 50) return;
      
      const user = { id: socket.id, name: cleanName };
      connectedUsers.set(socket.id, user);
      
      // Broadcast updated user list
      io.emit("users_list", Array.from(connectedUsers.values()));
      
      // Load and send message history
      const history = await loadMessages();
      socket.emit("message_history", history);
    });

    // Handle joining a specific room
    socket.on("join_room", (room: unknown) => {
      if (typeof room !== 'string') return;
      const cleanRoom = room.trim();
      if (!cleanRoom || cleanRoom.length > 50) return;
      
      // Leave previous rooms (except own id)
      Array.from(socket.rooms).forEach(r => {
        if (r !== socket.id) socket.leave(r);
      });
      
      socket.join(cleanRoom);
      console.log(`User ${socket.id} joined room: ${cleanRoom}`);
    });

    // Handle sending a public/room message
    socket.on("send_message", async (data: unknown) => {
      if (!data || typeof data !== 'object') return;
      const { room, text } = data as { room?: unknown, text?: unknown };
      
      if (typeof room !== 'string' || typeof text !== 'string') return;
      
      const cleanRoom = room.trim() || "general";
      const cleanText = text.trim();
      
      const user = connectedUsers.get(socket.id);
      if (!user || !cleanText || cleanText.length > 1000) return;

      const message: ChatMessage = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        room: cleanRoom,
        senderId: user.id,
        senderName: user.name,
        text: cleanText,
        timestamp: Date.now(),
        isPrivate: false
      };

      // Save to persistence
      await saveMessage(message);

      // Broadcast to room
      io.to(message.room).emit("receive_message", message);
    });

    // Handle sending a private message
    socket.on("send_private_message", async (data: unknown) => {
      if (!data || typeof data !== 'object') return;
      const { recipientId, text } = data as { recipientId?: unknown, text?: unknown };
      
      if (typeof recipientId !== 'string' || typeof text !== 'string') return;
      
      const cleanRecipientId = recipientId.trim();
      const cleanText = text.trim();
      
      const user = connectedUsers.get(socket.id);
      if (!user || !cleanText || cleanText.length > 1000 || !cleanRecipientId) return;

      const message: ChatMessage = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        room: "private",
        senderId: user.id,
        senderName: user.name,
        text: cleanText,
        timestamp: Date.now(),
        isPrivate: true,
        recipientId: cleanRecipientId
      };

      // Save to persistence
      await saveMessage(message);

      // Send to recipient and sender
      io.to(cleanRecipientId).emit("receive_message", message);
      socket.emit("receive_message", message);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
      connectedUsers.delete(socket.id);
      io.emit("users_list", Array.from(connectedUsers.values()));
    });
  });

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
