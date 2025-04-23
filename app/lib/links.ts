import { supabase, Link } from "./supabase";

/**
 * Fetch all links for the current user
 */
export async function getUserLinks(): Promise<Link[]> {
  try {
    // Get the current user session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      console.error("No authenticated user found when fetching links");
      throw new Error("User not authenticated");
    }

    console.log("Fetching links for user:", session.user.id);

    // Fetch links filtered by the current user's ID
    const { data: links, error } = await supabase
      .from("links")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(
        "Supabase error fetching links:",
        error.message,
        error.details,
        error.hint
      );
      throw error;
    }

    console.log(`Successfully fetched ${links?.length || 0} links`);
    return (links as Link[]) || [];
  } catch (error: any) {
    console.error(
      "Unexpected error in getUserLinks:",
      error?.message || "Unknown error",
      error
    );
    // Instead of silently returning an empty array, we'll throw the error
    // so it can be properly handled by the component
    throw error;
  }
}

/**
 * Create a new link for the current user
 */
export async function createLink(
  linkData: Omit<Link, "id" | "user_id" | "created_at" | "updated_at">
): Promise<Link | null> {
  // Get current user
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) {
    console.error("User not authenticated");
    return null;
  }

  const { data, error } = await supabase
    .from("links")
    .insert([
      {
        ...linkData,
        user_id: session.user.id,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating link:", error);
    return null;
  }

  return data as Link;
}

/**
 * Update an existing link
 */
export async function updateLink(
  id: string,
  linkData: Partial<Omit<Link, "id" | "user_id" | "created_at" | "updated_at">>
): Promise<Link | null> {
  const { data, error } = await supabase
    .from("links")
    .update(linkData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating link:", error);
    return null;
  }

  return data as Link;
}

/**
 * Delete a link
 */
export async function deleteLink(id: string): Promise<boolean> {
  const { error } = await supabase.from("links").delete().eq("id", id);

  if (error) {
    console.error("Error deleting link:", error);
    return false;
  }

  return true;
}
