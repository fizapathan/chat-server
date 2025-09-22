import { chatRooms } from "../models/ChatRooms.model.js";
import type { ChatRoom } from "../types/index.js";
import { generateUniqueId } from "../utils.js";

export function createOrGetChatRoom(userId1: string, userId2: string): {chatRoom: ChatRoom, isNew: boolean} {
  // Check if a chatroom already exists
  const existingChatRoom = chatRooms.find((room) =>
    room.memberIds.includes(userId1) && room.memberIds.includes(userId2)
  );

  if (existingChatRoom) {
    return { chatRoom: existingChatRoom, isNew: false };
  }

  // Create a new chatroom
  const newChatRoom: ChatRoom = {
    id: generateUniqueId(),
    memberIds: [userId1, userId2],
  };

  chatRooms.push(newChatRoom);
  return { chatRoom: newChatRoom, isNew: true };
}
