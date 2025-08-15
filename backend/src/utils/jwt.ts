import jwt from "jsonwebtoken";

const SECRET_KEY =
  "1f2c7d93b83942b79d3faeb51aa98d91e901a679c1f6fbd05d75b36e8716e1a7";

export const generateToken = (id: string, username: string, role: string) => {
  const payload = { id, username, role };
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
};
