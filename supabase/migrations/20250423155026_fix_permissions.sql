-- Fix permissions for authenticated users to access the public schema
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- Grant specific permissions for the links table to authenticated users
GRANT ALL ON TABLE public.links TO authenticated;
GRANT ALL ON TABLE public.links TO anon;

-- Enable Row Level Security (RLS) for anon and authenticated roles
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon;