import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wkgkcnbqfsiquwzougtj.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZ2tjbmJxZnNpcXV3em91Z3RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNjk1NTYsImV4cCI6MjA3MDc0NTU1Nn0.mgZ30U9TPO-IaRXbpzjDEPwoT1emh28IzoxnNXisAug";
export const supabase = createClient(supabaseUrl, supabaseKey);
