import express, { type Request, type Response } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { createAuthRoutes } from "./routes/auth.js";
import { setupSocketHandlers } from "./socket/handlers.js";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Chat server is running!");
});

// Auth routes with /auth prefix - pass io instance for broadcasts
app.use("/auth", createAuthRoutes(io));

// Setup socket.io handlers
setupSocketHandlers(io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Mock server running on ${PORT}`);
});