import type { ChatRoom } from "../types/index.js";

// In-memory store for chat rooms (in a real app, this would be in a database)
export let chatRooms: ChatRoom[] = [];