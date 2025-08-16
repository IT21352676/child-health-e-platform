import { verify } from "crypto";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import { verifyToken } from "./jwt";

export const liveUsers = new Map<string, string>();
export const onlineState = new Map<string, boolean>();

const emitPresence = (uid: string, online: boolean, io: Server) => {
  if (onlineState.get(uid) === online) return;
  onlineState.set(uid, online);
  io.emit("presence:update", { uid, online, at: Date.now() });
};

export function setupRealtime(io: Server) {
  io.engine.generateId = (req) => {
    const q = (req as any)._query as Record<string, string | undefined>;
    const raw = q?.token || (req.headers["x-auth-token"] as string | undefined);
    if (typeof raw !== "string")
      return `anon:${Math.random().toString(36).slice(2)}`;

    try {
      const payload = verifyToken(raw) as {
        id?: string;
      };
      const uid = payload.id as string;
      if (!uid) throw new Error("No user id in token");
      return uid;
    } catch {
      return `invalid:${Math.random().toString(36).slice(2)}`;
    }
  };

  io.use((socket, next) => {
    const token =
      (socket.handshake.query?.token as string | undefined) ||
      (socket.handshake.headers["x-auth-token"] as string | undefined);
    if (!token) return next(new Error("Auth token required"));

    try {
      const payload = verifyToken(token) as { id?: string };
      const uid = payload.id as string;
      if (!uid) return next(new Error("Invalid token payload"));

      const engineId =
        ((socket as any).client?.id as string) ||
        ((socket as any).conn?.id as string);

      if (engineId !== uid) return next(new Error("Socket id mismatch"));
      socket.data.userId = uid;
      next();
    } catch {
      next(new Error("Auth failed"));
    }
  });

  io.on("connection", (socket) => {
    const uid = socket.data.userId as string;

    const prev = liveUsers.get(uid);
    if (prev && prev !== socket.id)
      io.sockets.sockets.get(prev)?.disconnect(true);

    liveUsers.set(uid, socket.id);
    emitPresence(uid, true, io);

    io.emit("presence:update", { uid, online: true });

    socket.on("disconnect", () => {
      if (liveUsers.get(uid) === socket.id) liveUsers.delete(uid);
      emitPresence(uid, false, io);
    });
  });
}
