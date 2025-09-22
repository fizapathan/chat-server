export interface User {
  id: string;
  name: string;
  email: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ChatMessage {
  id: string;
  chatRoomId: string; // reference of ChatRoom id
  senderId: string; // reference of User id
  senderName: string; // name of the sender
  receiverId?: string; // reference of User id
  text: string;
  type: 'text' | 'image' | 'video' | 'file'; // message type
  isRead: boolean;
  timestamp: number;
}

// chatroom: when a chat with a user is started, add them to chatroom: only one chatroom between two users
export interface ChatRoom {
  id: string;
  memberIds: string[]; // list of User ids
}

export interface ConnectedUser {
  user: User, 
  lastMessage: string, 
  unreadCount: number, 
  chatRoomId: string
}