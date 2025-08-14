import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { supabase } from "../utils/db";
import bcrypt from "bcryptjs";
import { User } from "../types/user";

export const getUserByUsername = async (
  username: string
): Promise<User | null> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single();

  if (error) {
    return null;
  }
  return data;
};

export const createUser = async ({
  username,
  password,
  role,
}: User): Promise<PostgrestSingleResponse<any> | null> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const response = await supabase
    .from("users")
    .insert([{ username, password: hashedPassword, role }]);

  if (response.error) {
    console.error("Error creating user:", response.error);
  }

  return response;
};
