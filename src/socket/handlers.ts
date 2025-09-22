import { Server, type Socket } from "socket.io";
import type { ChatMessage } from "../types/index.js";
import { users } from "../models/Users.model.js";
import { messages } from "../models/Chats.model.js";
import { getDashboardUsers } from "../services/Users.service.js";
import { createOrGetChatRoom } from "../services/ChatRoom.service.js";
import { addMessage, getChatHistory, getLast10Messages } from "../services/Chats.service.js";

export function setupSocketHandlers(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("New client connected:", socket.id);

    // Handle incoming messages
    socket.on("message:send", (msg: ChatMessage) => {
      console.log("Message received:", msg);
      const newMessage = addMessage(msg);
      io.emit("message:received", newMessage); // broadcast to all connected clients
    });

    // Handle client disconnect
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });

    // Send existing messages to newly connected client
    socket.emit("message:history", messages);

    socket.on("user:typing:start", (data: { userName: string }) => {
      const user = users.find(u => u.name === data.userName);
      if (user) {
        console.log("Typing user found:", user);
        socket.emit("typing:start", { userId: user.id, userName: user.name });
      }
    });

    socket.on("user:typing:stop", (data: { userName: string }) => {
      const user = users.find(u => u.name === data.userName);
      if (user) {
        console.log("Typing stopped:", user);
        socket.emit("typing:stop", { userId: user.id, userName: user.name });
      }
    });

    socket.on("user:status:online", (data: { userName: string }) => {
      const user = users.find(u => u.name === data.userName);
      if (user) {
        console.log("User online:", user);
        socket.emit("user:online", { userId: user.id, userName: user.name });
      }
    });

    socket.on("user:status:offline", (data: { userName: string }) => {
      const user = users.find(u => u.name === data.userName);
      if (user) {
        console.log("User offline:", user);
        socket.emit("user:offline", { userId: user.id, userName: user.name });
      }
    });

    // send dashboardusers; access the userid
    socket.on("users:get", async (userId: string) => {
      const dashboardUsers = await getDashboardUsers(userId);
      socket.emit("users:received", dashboardUsers);
    });

    socket.on("chatroom:getOrCreate", async (data: { currentUserId: string; withUserId: string }) => {
      const {chatRoom, isNew} = createOrGetChatRoom(data.currentUserId, data.withUserId);
      if(isNew) {
        const dashboardUsers = await getDashboardUsers(data.currentUserId);
        socket.emit("users:received", dashboardUsers);
      } else {
        socket.emit("chatroom:history", getChatHistory(chatRoom.id));
      }
    });

    socket.on("chatroom:getHistory", (chatRoomId: string) => {
      const history = getChatHistory(chatRoomId);
      socket.emit("chatroom:history", history);
    });
  });
}