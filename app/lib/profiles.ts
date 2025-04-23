import { supabase, Profile } from "./supabase";

/**
 * Get the user profile from the database
 */
export async function getUserProfile(): Promise<Profile | null> {
  try {
    // Get the current user session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      console.error("No authenticated user found when fetching profile");
      return null;
    }

    console.log("Fetching profile for user:", session.user.id);

    // Fetch profile filtered by the current user's ID - using 'id' instead of 'user_id'
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // Profile not found, which is okay for new users
        console.log("No profile found for this user");
        return null;
      }
      console.error(
        "Supabase error fetching profile:",
        error.message,
        error.details
      );
      throw error;
    }

    return profile as Profile;
  } catch (error: any) {
    console.error(
      "Unexpected error in getUserProfile:",
      error?.message || "Unknown error",
      error
    );
    throw error;
  }
}

/**
 * Create or update a user profile
 */
export async function saveUserProfile(profileData: {
  first_name: string;
  last_name: string;
  email: string;
  image_url?: string;
}): Promise<Profile | null> {
  try {
    // Get the current user session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      console.error("No authenticated user found when saving profile");
      return null;
    }

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", session.user.id)
      .single();

    if (existingProfile) {
      // Update existing profile
      const { data, error } = await supabase
        .from("profiles")
        .update(profileData)
        .eq("id", session.user.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating profile:", error);
        return null;
      }

      return data as Profile;
    } else {
      // Create new profile
      const { data, error } = await supabase
        .from("profiles")
        .insert([
          {
            ...profileData,
            id: session.user.id, // Using 'id' instead of 'user_id'
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating profile:", error);
        return null;
      }

      return data as Profile;
    }
  } catch (error) {
    console.error("Error in saveUserProfile:", error);
    return null;
  }
}

/**
 * Upload profile image to Supabase storage
 */
export async function uploadProfileImage(
  imageFile: File
): Promise<string | null> {
  try {
    // Get the current user session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      console.error("No authenticated user found when uploading image");
      return null;
    }

    const userId = session.user.id;
    const filePath = `${userId}/profile-image`;

    // Upload file to Supabase storage
    const { data, error } = await supabase.storage
      .from("profile-images")
      .upload(filePath, imageFile, {
        upsert: true,
        cacheControl: "3600",
        contentType: imageFile.type,
      });

    if (error) {
      console.error("Error uploading profile image:", error);
      return null;
    }

    // Get public URL for the uploaded image
    const {
      data: { publicUrl },
    } = supabase.storage.from("profile-images").getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error("Error in uploadProfileImage:", error);
    return null;
  }
}
