import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import { generateAdminToken } from "../utils/jwt";
import {
  createGovUser,
  getGovUserByEmail,
  getGovUserByUsername,
} from "../models/govAdmin";

export const adminLogin = async (req: Request, res: Response) => {
  if (!req.body) {
    return res.status(404).json({ message: "Body not provided" });
  }
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(404).json({ message: "All fields required" });
  }

  const user = await getGovUserByEmail(email);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const passwordMatch = bcrypt.compareSync(password, user.password_hash);
  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateAdminToken(
    user.ofiicial_id,
    user.department_id,
    user.first_name,
    user.last_name,
    user.email,
    user.role
  );
  return res.json({
    token,
    ofiicial_id: user.ofiicial_id,
    department_id: user.department_id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    role: user.role,
  });
};

export const adminRegister = async (req: Request, res: Response) => {
  if (!req.body) {
    return res.status(404).json({ message: "Body not provided" });
  }
  const { department_id, first_name, last_name, email, password, role } =
    req.body;

  if (
    !first_name ||
    !password ||
    !role ||
    !department_id ||
    !last_name ||
    !email
  ) {
    return res.status(404).json({ message: "All fields required" });
  }

  const checkUsername = await getGovUserByUsername(first_name, last_name);
  {
    if (checkUsername) {
      return res.status(409).json({ message: "This usernames already exists" });
    }
  }

  const chcekUserEmail = await getGovUserByEmail(email);
  {
    if (chcekUserEmail) {
      return res.status(409).json({ message: "This email already exists" });
    }
  }

  const response = await createGovUser(
    department_id,
    first_name,
    last_name,
    email,
    password,
    role
  );

  if (response?.error) {
    return res.status(400).json({ message: response?.error });
  }

  if (response?.status === 201) {
    return res
      .status(200)
      .json({ message: "Gov user registered successfully" });
  } else {
    console.error("Something went wrong");
    return res.status(400).json({ message: "Something went wrong" });
  }
};
