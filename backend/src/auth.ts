import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = express.Router();

export const JWT_SECRET =
  "1f2c7d93b83942b79d3faeb51aa98d91e901a679c1f6fbd05d75b36e8716e1a7";

const user = {
  username: "admin",
  password: "$2b$10$uTUCo9vRZ91KI7W8FhcWR.deei/UZdw1TjThZvB4H/ol17.l28Q6a",
};

// Super Admin Login
router.post("/login", async (req: any, res: any) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (user.username !== username || isMatch === false) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ username: user.username }, JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
});

export default router;
