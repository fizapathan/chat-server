import { messages } from "../models/Chats.model.js";
import type { ChatMessage } from "../types/index.js";
import { generateUniqueId } from "../utils.js";

export function addMessage(msg: ChatMessage): ChatMessage {
  const newMessage: ChatMessage = { 
    id: generateUniqueId(),
    senderId: msg.senderId,
    chatRoomId: msg.chatRoomId,
    senderName: msg.senderName,
    text: msg.text,
    type: msg.type || 'text',
    isRead: false,
    timestamp: Date.now()
   };
  messages.push(newMessage);
  return newMessage;
}

export function getChatHistory(chatRoomId: string) {
  // Filter messages between the two users
  return messages.filter(
    (msg) =>
      (msg.chatRoomId === chatRoomId)
  );
}

export function getLast10Messages(chatRoomId: string) {
  const chatHistory = getChatHistory(chatRoomId);
  // Sort messages by timestamp in descending order and take the last 10
  return chatHistory
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10)
    // .reverse(); // Reverse to have them in chronological order
}

export function getLastMessageAndUnreadCount(chatRoomId: string, userId: string) {
  const chatHistory = getChatHistory(chatRoomId);
  const lastMessage = chatHistory[chatHistory.length - 1]?.text || "Draft";
  const unreadCount = chatHistory.filter((msg) => msg.senderId !== userId && !msg.isRead).length;

  return { lastMessage, unreadCount };
}

