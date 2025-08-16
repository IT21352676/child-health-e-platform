import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { supabase } from "../utils/db";
import bcrypt from "bcryptjs";

import { User } from "../types/user";

export const getUserById = async (user_id: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("user_id", user_id)
    .single();

  if (error) {
    return null;
  }
  return data;
};

export const getUserByUsername = async (
  first_name: string,
  last_name: string
): Promise<User | null> => {
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("first_name", first_name)
    .eq("last_name", last_name)
    .single();

  if (error) {
    return null;
  }
  return data;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    return null;
  }
  return data;
};

export const createUser = async (
  first_name: string,
  last_name: string,
  email: string,
  password_hash: string,
  phone_number: string
): Promise<PostgrestSingleResponse<any> | null> => {
  const hashedPassword = await bcrypt.hash(password_hash, 10);
  const response = await supabase.from("user").insert([
    {
      first_name,
      last_name,
      email,
      password_hash: hashedPassword,
      phone_number,
    },
  ]);

  if (response.error) {
    console.error("Error creating  user:", response.error);
  }

  return response;
};

export const updateUser = async (
  user_id: string,
  first_name: string,
  last_name: string,
  email: string,
  password_hash: string,
  phone_number: string
) => {
  const response = await supabase
    .from("user")
    .update({
      first_name,
      last_name,
      email,
      password_hash,
      phone_number,
    })
    .eq("user_id", user_id);

  if (response.error) {
    console.error("Error creating  user:", response.error);
  }

  return response;
};
