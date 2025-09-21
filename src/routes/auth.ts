import express, { type Request, type Response } from "express";
import type { User, SignUpRequest, LoginRequest } from "../types/index.js";

const router = express.Router();

// In-memory store for users (in a real app, this would be in a database)
export let users: User[] = [];

// Login endpoint
router.post("/login", (req: Request<{}, {}, LoginRequest>, res: Response) => {
  const { email, password } = req.body;
  console.log(`Login attempt for: ${email}`);
  console.log("users:", users);
  
  const user = users.find((u) => u.email === email && u.password === password);
  if (user === undefined) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  
  console.log(`User logged in: ${email}`);
  res.json({ 
    user: { email, id: user.id, name: user.name }, 
    token: `mock-token-${email}`, 
    refreshToken: `mock-refresh-token-${email}` 
  });
});

// Logout endpoint
router.get("/logout", (req: Request, res: Response) => {
  // invalidate the token here
  res.json({ message: "Logged out successfully" });
});

// Signup endpoint
router.post("/signup", (req: Request<{}, {}, SignUpRequest>, res: Response) => {
  const { name, email, password } = req.body;
  console.log(`Signup attempt for: ${email}`);
  
  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ message: "User already exists" });
  }
  
  const id = Math.random().toString(36).substring(2, 15);
  users.push({ id, name, email, password });
  console.log(`User signed up: ${email}`);
  console.log("users:", users);
  
  res.json({ 
    user: { email, id, name }, 
    token: `mock-token-${email}`, 
    refreshToken: `mock-refresh-token-${email}` 
  });
});

export default router;