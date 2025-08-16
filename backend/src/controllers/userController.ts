import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import { generateUserToken } from "../utils/jwt";
import {
  createUser,
  getUserByEmail,
  getUserById,
  getUserByUsername,
  updateUser,
} from "../models/user";
import { User } from "../types/user";

export const userLogin = async (req: Request, res: Response) => {
  if (!req.body) {
    return res.status(404).json({ message: "Body not provided" });
  }
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(404).json({ message: "All fields required" });
  }

  const user = await getUserByEmail(email);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const passwordMatch = bcrypt.compareSync(password, user.password_hash);
  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateUserToken(
    user.user_id,
    user.first_name,
    user.last_name,
    user.email,
    user.phone_number
  );
  return res.json({
    token,
    user_id: user.user_id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone_number: user.phone_number,
  });
};

export const userRegister = async (req: Request, res: Response) => {
  if (!req.body) {
    return res.status(404).json({ message: "Body not provided" });
  }
  const { first_name, last_name, email, password, phone_number } = req.body;

  if (!first_name || !password || !phone_number || !last_name || !email) {
    return res.status(404).json({ message: "All fields required" });
  }

  const checkUsername = await getUserByUsername(first_name, last_name);
  {
    if (checkUsername) {
      return res.status(409).json({ message: "This usernames already exists" });
    }
  }

  const chcekUserEmail = await getUserByEmail(email);
  {
    if (chcekUserEmail) {
      return res.status(409).json({ message: "This email already exists" });
    }
  }

  const response = await createUser(
    first_name,
    last_name,
    email,
    password,
    phone_number
  );

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

export const fetchUserDetails = async (req: Request, res: Response) => {
  const user: User = req.user;
  if (!user) {
    return res
      .status(404)
      .json({ message: "User not authorized, cant find user details" });
  }

  const userData = await getUserById(user.user_id);
  if (!userData) {
    return res.status(401).json({ message: "User data not found" });
  }
  return res.status(200).json({ user: userData });
};

export const userDetailsUpdate = async (req: Request, res: Response) => {
  const user: User = req.user;
  if (!user) {
    return res
      .status(404)
      .json({ message: "User not authorized, cant find user details" });
  }

  if (!req.body) {
    return res.status(404).json({ message: "Body not provided" });
  }

  const {
    new_first_name,
    new_last_name,
    new_email,
    new_password,
    new_phone_number,
  } = req.body;

  if (
    new_first_name ||
    new_password ||
    new_phone_number ||
    new_last_name ||
    new_email
  ) {
    const oldUser = await getUserById(user.user_id);

    if (!oldUser) {
      return res.status(409).json({ message: "User not found" });
    }

    const chcekUserEmail = await getUserByEmail(new_email);
    {
      if (chcekUserEmail && chcekUserEmail?.user_id !== user.user_id) {
        return res.status(409).json({ message: "This email already exists" });
      }
    }

    const checkUsername = await getUserByUsername(
      new_first_name,
      new_last_name
    );
    {
      if (checkUsername && checkUsername?.user_id !== user.user_id) {
        return res
          .status(409)
          .json({ message: "This usernames already exists" });
      }
    }

    if (new_password) {
      const passwordMatch = bcrypt.compareSync(
        new_password,
        oldUser.password_hash
      );

      if (passwordMatch) {
        return res
          .status(409)
          .json({ message: "New password cannot be same as the old password" });
      }
    }

    const updatedUser = {
      first_name: new_first_name ?? oldUser.first_name,
      last_name: new_last_name ?? oldUser.last_name,
      email: new_email ?? oldUser.email,
      password: new_password
        ? await bcrypt.hash(new_password, 10)
        : oldUser.password_hash,
      phone_number: new_phone_number ?? oldUser.phone_number,
    };
    const response = await updateUser(
      user.user_id,
      updatedUser.first_name,
      updatedUser.last_name,
      updatedUser.email,
      updatedUser.password,
      updatedUser.phone_number
    );

    if (response?.error) {
      return res.status(400).json({ message: response?.error });
    }

    if (response?.status === 204) {
      const token = generateUserToken(
        user.user_id,
        updatedUser.first_name,
        updatedUser.last_name,
        updatedUser.email,
        updatedUser.phone_number
      );
      return res.status(200).json({
        message: "User updated successfully",
        token,
        user_id: user.user_id,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        email: updatedUser.email,
        phone_number: updatedUser.phone_number,
      });
    } else {
      console.error("Something went wrong");
      return res.status(400).json({ message: "Something went wrong" });
    }
  } else {
    return res
      .status(404)
      .json({ message: "For update, provide at least one field" });
  }
};
