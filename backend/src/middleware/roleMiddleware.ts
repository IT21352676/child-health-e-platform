import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { RoleTypes } from "../types/roles";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const checkRole = (roles: RoleTypes[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }

    const decoded = verifyToken(token);
    if (!decoded || typeof decoded === "string" || !("role" in decoded)) {
      return res.status(401).json({ message: "Invalid token" });
    }

    if (!roles.includes((decoded as any).role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    req.user = decoded;
    next();
  };
};
