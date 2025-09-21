import express, { type Request, type Response } from "express";
import http from "http";
import { Server, type Socket } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

// Types
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface ChatMessage {
  user: string;
  text: string;
  timestamp: number;
}

// In-memory store for users and messages
let users: User[] = [];
let messages: ChatMessage[] = [];
app.get("/", (req: Request, res: Response) => {
  res.send("Chat server is running and updated!");
});

// Mock auth (no DB, just returns token)
app.post("/login", (req: Request<{}, {}, LoginRequest>, res: Response) => {
  const { email, password } = req.body;
  console.log(`Login attempt for: ${email}`);
  console.log("users:", users);
  const user = users.find((u) => u.email === email && u.password === password)
  if(user === undefined) return res.status(401).json({ message: "Invalid credentials" });
  console.log(`User logged in: ${email}`);
  res.json({ user: { email, id: user.id, name: user.name }, token: `mock-token-${email}`, refreshToken: `mock-refresh-token-${email}` });
});

app.get("/logout", (req: Request, res: Response) => {
  // invalidate token here
  res.json({ message: "Logged out successfully" });
});

app.post("/signup", (req: Request<{}, {}, SignUpRequest>, res: Response) => {
  const { name, email, password } = req.body;
  console.log(`Signup attempt for: ${email}`);
  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ message: "User already exists" });
  }
  const id = Math.random().toString(36).substring(2, 15);
  users.push({ id, name, email, password });
  console.log(`User signed up: ${email}`);
  console.log("users:", users);
  res.json({ user: { email, id, name }, token: `mock-token-${email}`, refreshToken: `mock-refresh-token-${email}` });
});

io.on("connection", (socket: Socket) => {
  console.log("New client connected:", socket.id);

  socket.on("message:send", (msg: ChatMessage) => {
    console.log("Message received:", msg);
    messages.push(msg);
    io.emit("receive_message", msg); // broadcast to all
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(4000, () => {
  console.log("Mock server running on http://localhost:4000");
});
