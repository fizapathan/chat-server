import type { ChatMessage } from "../types/index.js";

// In-memory store for messages (in a real app, this would be in a database)
export let messages: ChatMessage[] = [];