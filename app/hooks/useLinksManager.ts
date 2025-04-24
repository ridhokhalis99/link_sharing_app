import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getUserLinks,
  createLink,
  updateLink,
  deleteLink,
  updateLinksOrder,
} from "../lib/links";
import { PlatformType } from "../components/icons/platform/PlatformIcon";

export interface LinkItem {
  id?: string;
  platform: PlatformType | string;
  url: string;
  order?: number;
  isNew?: boolean;
  isModified?: boolean;
  isDeleted?: boolean;
  isReordered?: boolean;
}

/**
 * Custom hook for managing links, handling CRUD operations and state
 */
export function useLinksManager(initialLinks: LinkItem[] = []) {
  const [originalLinks, setOriginalLinks] = useState<LinkItem[]>([]);
  const [links, setLinks] = useState<LinkItem[]>(initialLinks);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [orderChanged, setOrderChanged] = useState<boolean>(false);
  const { user } = useAuth();

  // Fetch links on component mount or when user changes
  useEffect(() => {
    let isMounted = true;
    const fetchLinks = async () => {
      if (!user) {
        console.log("No user found, waiting for auth context to initialize...");
        if (isMounted) {
          setIsLoading(false);
          setLinks([]);
          setOriginalLinks([]);
        }
        return;
      }

      setIsLoading(true);
      try {
        console.log("Attempting to fetch links for user:", user.id);
        const userLinks = await getUserLinks();

        if (isMounted) {
          const formattedLinks = userLinks.map((link) => ({
            id: link.id,
            platform: link.platform,
            url: link.url,
            order: link.order,
          }));

          formattedLinks.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

          setOriginalLinks(formattedLinks);
          setLinks(formattedLinks);
          setError(null);
        }
      } catch (error: any) {
        console.error("Error in useLinksManager when fetching links:", error);
        if (isMounted) {
          if (error.message === "User not authenticated") {
            setError(
              "You must be logged in to view your links. Please log in again."
            );
          } else {
            setError(
              `Failed to load links: ${error.message || "Unknown error"}`
            );
          }
          setLinks([]);
          setOriginalLinks([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchLinks();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  // Add a new link
  const addNewLink = () => {
    const highestOrder = links.reduce(
      (max, link) => Math.max(max, link.order ?? 0),
      -1
    );

    const newLink = {
      platform: "GitHub",
      url: "",
      order: highestOrder + 1,
      isNew: true,
    };

    const newLinks = [...links, newLink];
    setLinks(newLinks);
    return newLinks;
  };

  // Remove a link
  const removeLink = (index: number) => {
    const linkToRemove = links[index];

    if (linkToRemove.isNew) {
      const newLinks = [...links];
      newLinks.splice(index, 1);
      setLinks(newLinks);
      return newLinks;
    } else {
      const newLinks = [...links];
      newLinks[index] = {
        ...linkToRemove,
        isDeleted: true,
      };
      setLinks(newLinks);
      return newLinks.filter((link) => !link.isDeleted);
    }
  };

  // Update a link
  const updateLinkItem = (index: number, platform: string, url: string) => {
    const linkToUpdate = links[index];
    const newLinks = [...links];

    newLinks[index] = {
      ...linkToUpdate,
      platform,
      url,
      isModified: linkToUpdate.isNew ? undefined : true,
    };

    setLinks(newLinks);
    return newLinks.filter((link) => !link.isDeleted);
  };

  // Reorder links
  const reorderLinks = (dragIndex: number, hoverIndex: number) => {
    const updatedLinks = [...links];

    const draggedItem = updatedLinks[dragIndex];
    updatedLinks.splice(dragIndex, 1);
    updatedLinks.splice(hoverIndex, 0, draggedItem);

    const reorderedLinks = updatedLinks.map((link, index) => ({
      ...link,
      order: index,
      isReordered: link.id && !link.isNew ? true : link.isReordered,
    }));

    setLinks(reorderedLinks);
    setOrderChanged(true);
    return reorderedLinks.filter((link) => !link.isDeleted);
  };

  // Save all changes
  const saveLinks = async () => {
    setIsSaving(true);

    try {
      const savePromises: Promise<any>[] = [];

      // Create new links
      const newLinks = links.filter((link) => link.isNew && !link.isDeleted);
      for (const link of newLinks) {
        savePromises.push(
          createLink({
            platform: link.platform,
            url: link.url,
            title: link.platform,
          })
        );
      }

      // Update modified links
      const modifiedLinks = links.filter(
        (link) => link.isModified && !link.isDeleted
      );
      for (const link of modifiedLinks) {
        if (link.id) {
          savePromises.push(
            updateLink(link.id, {
              platform: link.platform,
              url: link.url,
              title: link.platform,
            })
          );
        }
      }

      // Delete marked links
      const deletedLinks = links.filter(
        (link) => link.isDeleted && !link.isNew && link.id
      );
      for (const link of deletedLinks) {
        if (link.id) {
          savePromises.push(deleteLink(link.id));
        }
      }

      // Update order if changed
      if (orderChanged) {
        const linksToReorder = links
          .filter((link) => link.id && !link.isDeleted)
          .map((link, index) => ({
            id: link.id!,
            order: index,
          }));

        if (linksToReorder.length > 0) {
          savePromises.push(updateLinksOrder(linksToReorder));
        }
      }

      await Promise.all(savePromises);

      // Refresh links from server
      const updatedLinks = await getUserLinks();
      const formattedLinks = updatedLinks.map((link) => ({
        id: link.id,
        platform: link.platform,
        url: link.url,
        order: link.order,
      }));

      setOriginalLinks(formattedLinks);
      setLinks(formattedLinks);
      setOrderChanged(false);

      console.log("All changes saved successfully");
      return formattedLinks;
    } catch (error) {
      console.error("Error saving changes:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // Check if there are unsaved changes
  const hasUnsavedChanges =
    links.some(
      (link) =>
        link.isNew || link.isModified || link.isDeleted || link.isReordered
    ) || orderChanged;

  // Get visible links (not deleted)
  const visibleLinks = links.filter((link) => !link.isDeleted);

  return {
    links: visibleLinks,
    isLoading,
    isSaving,
    error,
    hasUnsavedChanges,
    addNewLink,
    removeLink,
    updateLinkItem,
    reorderLinks,
    saveLinks,
  };
}
