import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { createUser, getUserByUsername } from "../models/user";
import { generateToken } from "../utils/jwt";

export const login = async (req: Request, res: Response) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "Request body is required" });
  }
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(404).json({ message: "All fields required" });
  }

  const user = await getUserByUsername(username);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const passwordMatch = bcrypt.compareSync(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (!user.id || !user.username || !user.role) {
    return res.status(500).json({ message: "User data is incomplete" });
  }
  const token = generateToken(user.id, user.username, user.role);
  return res.json({ token, id: user.id, user: user.username, role: user.role });
};

export const register = async (req: Request, res: Response) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "Request body is required" });
  }
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(404).json({ message: "All fields required" });
  }

  const user = await getUserByUsername(username);
  {
    if (user) {
      return res.status(409).json({ message: "This username already exists" });
    }
  }

  const response = await createUser({ username, password, role });

  if (response?.error) {
    return res.status(400).json({ message: response?.error });
  }

  if (response?.status === 201) {
    return res.status(200).json({ message: "User registered successfully" });
  } else {
    console.error("Something went wrong");
    return res.status(400).json({ message: "Something went wrong" });
  }
};
