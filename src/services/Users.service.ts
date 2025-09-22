import { get } from "http";
import { chatRooms } from "../models/ChatRooms.model.js";
import { users } from "../models/Users.model.js";
import type { ConnectedUser, User } from "../types/index.js";
import { getLastMessageAndUnreadCount } from "./Chats.service.js";

// Function to retrieve all users 
async function getDashboardUsers(currentUserId: string): Promise<{
    connectedUsers: ConnectedUser[];
    nonConnectedUsers: User[];
}> {
  try {
    const connectedUsers = await getConnectedUsers(currentUserId);
    const nonConnectedUsers = users
      .filter(user => user.id !== currentUserId && !connectedUsers.some(cu => cu.user.id === user.id))
      .map(({ password, ...rest }) => rest); // Exclude password
    const allUsers = {connectedUsers, nonConnectedUsers};
    console.log("All users:", allUsers);
    return allUsers;
  } catch (error) {
    throw new Error('Error fetching users: ' + error);
  }
}

/**
 * @param currentUserId current user id
 * @returns list of users connected with the user (have chatrooms with)
 */
async function getConnectedUsers(currentUserId: string): Promise<ConnectedUser[]> {
  try {
    // Find chatrooms for the user
    const chatrooms = chatRooms.filter((room) => room.memberIds.includes(currentUserId));
    // Get unique user IDs from the chatrooms
    const connectedUserIds = new Map<string, { chatRoomId: string; lastMessage: string; unreadCount: number }>(); // new Set<string>();
    chatrooms.forEach((room) => {
      room.memberIds.forEach((id) => {
        if (id !== currentUserId) {
          const { lastMessage, unreadCount } = getLastMessageAndUnreadCount(room.id, currentUserId);
          connectedUserIds.set(id, { chatRoomId: room.id, lastMessage, unreadCount });
        }
      });
    });
    // Find user objects for the connected user IDs
    return users.filter((user) => connectedUserIds.has(user.id)).map((user) => {
      const { password, ...rest } = user;
      const connectionData = connectedUserIds.get(user.id)!;
      return { user: { ...rest }, lastMessage: connectionData.lastMessage, unreadCount: connectionData.unreadCount, chatRoomId: connectionData.chatRoomId };
    });
  } catch (error) {
    throw new Error('Error fetching connected users: ' + error);
  }
}

export { getDashboardUsers };
