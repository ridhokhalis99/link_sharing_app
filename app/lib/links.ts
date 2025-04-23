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

    // Fetch links filtered by the current user's ID and ordered by the order field
    const { data: links, error } = await supabase
      .from("links")
      .select("*")
      .eq("user_id", session.user.id)
      .order("order", { ascending: true });

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
    throw error;
  }
}

/**
 * Create a new link for the current user
 */
export async function createLink(
  linkData: Omit<Link, "id" | "user_id" | "created_at" | "updated_at" | "order">
): Promise<Link | null> {
  try {
    // Get current user
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      console.error("User not authenticated");
      return null;
    }

    // Get highest current order value
    const { data: links, error: orderError } = await supabase
      .from("links")
      .select("order")
      .eq("user_id", session.user.id)
      .order("order", { ascending: false })
      .limit(1);

    const highestOrder = links && links.length > 0 ? links[0].order : -1;
    const newOrder = highestOrder + 1;

    // Create the new link with the next order value
    const { data, error } = await supabase
      .from("links")
      .insert([
        {
          ...linkData,
          user_id: session.user.id,
          order: newOrder,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating link:", error);
      return null;
    }

    return data as Link;
  } catch (error) {
    console.error("Error in createLink:", error);
    return null;
  }
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
 * Update the order of multiple links at once
 */
export async function updateLinksOrder(
  links: { id: string; order: number }[]
): Promise<boolean> {
  try {
    // First, fetch the existing links to get all required fields
    const linkIds = links.map((link) => link.id);
    const { data: existingLinks, error: fetchError } = await supabase
      .from("links")
      .select("*")
      .in("id", linkIds);

    if (fetchError) {
      console.error("Error fetching links for order update:", fetchError);
      return false;
    }

    if (!existingLinks) {
      console.error("No links found to update order");
      return false;
    }

    // Create array of complete update operations with all required fields
    const updates = existingLinks.map((existingLink) => {
      // Find the new order for this link
      const newOrderInfo = links.find((link) => link.id === existingLink.id);

      return {
        ...existingLink,
        order: newOrderInfo?.order ?? existingLink.order,
      };
    });

    // Use upsert to update multiple rows at once
    const { error } = await supabase.from("links").upsert(updates);

    if (error) {
      console.error("Error updating link order:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in updateLinksOrder:", error);
    return false;
  }
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
