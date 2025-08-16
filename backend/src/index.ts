import express from "express";
import bodyParser from "body-parser";
import adminAuthRoutes from "./routes/govAuthRoutes";
import userAuthRoutes from "./routes/userAuthRoutes";
import cors from "cors";

const app = express();
app.use(bodyParser.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/admin-auth", adminAuthRoutes);
app.use("/user-auth", userAuthRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


// const SOCKET_PORT = 5001;
// httpServer.listen(SOCKET_PORT, () => {
//   console.log(`Socket running on http://localhost:${SOCKET_PORT}`);
// });

// app.get("/secured/presence/:userId", (req, res) => {
//   const userId = req.params.userId;
//   const online = liveUsers.has(userId);
//   res.json({ userId, online });
// });

// // server.ts (or a presence router)
// app.get("/secured/presence", (_req, res) => {
//   const users = [...liveUsers.keys()];
//   res.json({ count: users.length, users });
// });

// export { io };

