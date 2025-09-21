import { Server, type Socket } from "socket.io";
import type { ChatMessage } from "../types/index.js";

// In-memory store for messages (in a real app, this would be in a database)
export let messages: ChatMessage[] = [];

export function setupSocketHandlers(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("New client connected:", socket.id);

    // Handle incoming messages
    socket.on("message:send", (msg: ChatMessage) => {
      console.log("Message received:", msg);
      messages.push(msg);
      io.emit("message:received", msg); // broadcast to all connected clients
    });

    // Handle client disconnect
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });

    // Send existing messages to newly connected client
    socket.emit("message:history", messages);
  });
}