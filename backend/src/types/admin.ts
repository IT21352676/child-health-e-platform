import { RoleTypes } from "./roles";

export interface GovUser {
  ofiicial_id: string;
  department_id: string;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  role: RoleTypes;
}
