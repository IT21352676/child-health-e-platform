import express from "express";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes";
import serviceRoutes from "./routes/serviceRoutes";
import http from "http";
import { Server } from "socket.io";
import { setupRealtime, liveUsers } from "./utils/socket";

const app = express();
app.use(bodyParser.json());

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: { origin: "*", credentials: true },
});

app.use("/auth", authRoutes);
app.use("/secured/services", (req, res) => {
  serviceRoutes(req, res, io);
});

setupRealtime(io);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const SOCKET_PORT = 5001;
httpServer.listen(SOCKET_PORT, () => {
  console.log(`Socket running on http://localhost:${SOCKET_PORT}`);
});

app.get("/secured/presence/:userId", (req, res) => {
  const userId = req.params.userId;
  const online = liveUsers.has(userId);
  res.json({ userId, online });
});

// server.ts (or a presence router)
app.get("/secured/presence", (_req, res) => {
  const users = [...liveUsers.keys()];
  res.json({ count: users.length, users });
});

export { io };
