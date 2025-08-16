import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { supabase } from "../utils/db";
import bcrypt from "bcryptjs";
import { GovUser } from "../types/admin";

export const getGovUserById = async (
  official_id: string
): Promise<GovUser | null> => {
  const { data, error } = await supabase
    .from("government_official")
    .select("*")
    .eq("official_id", official_id)
    .single();

  if (error) {
    return null;
  }
  return data;
};

export const getGovUserByUsername = async (
  first_name: string,
  last_name: string
): Promise<GovUser | null> => {
  const { data, error } = await supabase
    .from("government_official")
    .select("*")
    .eq("first_name", first_name)
    .eq("last_name", last_name)
    .single();

  if (error) {
    return null;
  }
  return data;
};

export const getGovUserByEmail = async (
  email: string
): Promise<GovUser | null> => {
  const { data, error } = await supabase
    .from("government_official")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    return null;
  }
  return data;
};

export const createGovUser = async (
  department_id: string,
  first_name: string,
  last_name: string,
  email: string,
  password_hash: string,
  role: string
): Promise<PostgrestSingleResponse<any> | null> => {
  const hashedPassword = await bcrypt.hash(password_hash, 10);
  const response = await supabase.from("government_official").insert([
    {
      department_id,
      first_name,
      last_name,
      email,
      password_hash: hashedPassword,
      role,
    },
  ]);

  if (response.error) {
    console.error("Error creating gov user:", response.error);
  }

  return response;
};
