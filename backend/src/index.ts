import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { initializeSocket } from "./config/socket";
import authRoutes from "./routes/authRoutes";
import serviceRoutes from "./routes/serviceRoutes";
import documentRoutes from "./routes/documentRoutes";
import feedbackRoutes from "./routes/feedbackRoutes";
import notificationRoutes from "./routes/notificationRoutes";

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO
const socketManager = initializeSocket(httpServer);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/auth", authRoutes);
app.use("/secured/services", serviceRoutes);
app.use("/documents", documentRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/notifications", notificationRoutes);

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', error);
  res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Socket.IO server initialized`);
  console.log(`Connected users: ${socketManager.getConnectedUsersCount()}`);
});
