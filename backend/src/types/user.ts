import { RoleTypes } from "./roles";

export interface User {
  id?: string;
  username: string;
  password: string;
  role: RoleTypes;
}
