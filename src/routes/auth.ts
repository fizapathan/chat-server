import express, { type Request, type Response } from "express";
import type { SignUpRequest, LoginRequest } from "../types/index.js";
import { users } from "../models/Users.model.js";
import type { Server } from "socket.io";
import { generateUniqueId } from "../utils.js";

export function createAuthRoutes(io: Server) {
  const router = express.Router();

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
    
    const id = generateUniqueId();
    const newUser = { id, name, email, password };
    users.push(newUser);
    console.log(`User signed up: ${email}`);
    console.log("users:", users);
    
    // Broadcast new user to all connected clients except the new user
    io.emit("user:new", { 
      user: { id, name, email },
      message: `${name} joined the chat!` 
    });
    
    res.json({ 
      user: { email, id, name }, 
      token: `mock-token-${email}`, 
      refreshToken: `mock-refresh-token-${email}` 
    });
  });

  return router;
}