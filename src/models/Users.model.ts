import type { User } from "../types/index.js";
type UserModel = User & { password: string };

// In-memory store for users (in a real app, this would be in a database)
export let users: UserModel[] = [];