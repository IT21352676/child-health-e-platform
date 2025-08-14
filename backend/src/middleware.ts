import { JWT_SECRET } from "./auth";

const jwt = require("jsonwebtoken");

export default function (req: any, res: any, next: any) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Expecting "Bearer TOKEN"

  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user data to request
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
}
