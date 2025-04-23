import { createBrowserClient } from "@supabase/ssr";

// Create a single supabase client for browser-side usage
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Define types for our database tables
export type Link = {
  id: string;
  user_id: string;
  url: string;
  title: string;
  platform: string;
  order: number;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string; // This is both the primary key and the user ID (from auth.users)
  first_name: string;
  last_name: string;
  email: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
};
