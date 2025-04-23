-- Create a storage bucket for profile images
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up access policies for the profile-images bucket
-- Allow users to view their own profile images (and public ones)
CREATE POLICY "Users can view own profile images" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'profile-images' AND (auth.uid() = owner OR owner IS NULL));

-- Allow users to upload their own profile images
CREATE POLICY "Users can upload own profile images" ON storage.objects
    FOR INSERT
    WITH CHECK (bucket_id = 'profile-images' AND auth.uid() = owner);

-- Allow users to update their own profile images
CREATE POLICY "Users can update own profile images" ON storage.objects
    FOR UPDATE
    USING (bucket_id = 'profile-images' AND auth.uid() = owner)
    WITH CHECK (bucket_id = 'profile-images' AND auth.uid() = owner);

-- Allow users to delete their own profile images
CREATE POLICY "Users can delete own profile images" ON storage.objects
    FOR DELETE
    USING (bucket_id = 'profile-images' AND auth.uid() = owner);