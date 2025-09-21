export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
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
  user: string;
  text: string;
  timestamp: number;
}