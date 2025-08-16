import jwt from "jsonwebtoken";
import { RoleTypes } from "../types/roles";

const SECRET_KEY =
  "1f2c7d93b83942b79d3faeb51aa98d91e901a679c1f6fbd05d75b36e8716e1a7";

export const generateAdminToken = (
  ofiicial_id: string,
  department_id: string,
  first_name: string,
  last_name: string,
  email: string,
  role: RoleTypes
) => {
  const payload = {
    ofiicial_id,
    department_id,
    first_name,
    last_name,
    email,
    role,
  };
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
};
