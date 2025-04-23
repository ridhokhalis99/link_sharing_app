import React, { useState, useEffect } from "react";
import LinkCard from "./LinkCard";
import { getUserLinks, createLink, updateLink, deleteLink } from "../lib/links";
import { Link } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export interface LinkItem {
  id?: string;
  platform: string;
  url: string;
}

interface LinksManagerProps {
  onLinksChange: (links: LinkItem[]) => void;
  initialLinks?: LinkItem[];
}

/**
 * EmptyState component for when no links are present
 */
const EmptyState: React.FC<{ onAddLink: () => void }> = ({ onAddLink }) => (
  <div className="bg-[#FAFAFA] rounded-lg p-6 flex flex-col items-center justify-center text-center">
    <div className="w-20 h-20 mb-4 flex items-center justify-center">
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M40 68.3333C55.6917 68.3333 68.3333 55.6917 68.3333 40C68.3333 24.3083 55.6917 11.6667 40 11.6667C24.3083 11.6667 11.6667 24.3083 11.6667 40C11.6667 55.6917 24.3083 68.3333 40 68.3333Z"
          stroke="#633CFF"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M26.6667 40H53.3333"
          stroke="#633CFF"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M40 26.6667V53.3333"
          stroke="#633CFF"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
    <h3 className="text-xl font-bold mb-4">Let's get you started</h3>
    <p className="text-gray-500 mb-6">
      Use the "Add New Link" button to get started. Once you have more than one
      link, you can reorder and edit them. We're here to help you share your
      profiles with everyone!
    </p>
    <button
      className="btn-primary px-6 py-3 bg-[#633CFF] text-white rounded-lg hover:bg-[#5332D5] transition-colors"
      onClick={onAddLink}
      aria-label="Add your first link"
    >
      Add your first link
    </button>
  </div>
);

/**
 * AddLinkButton component for adding new links
 */
const AddLinkButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    className="btn-secondary w-full py-3 border-2 border-[#633CFF] text-[#633CFF] font-medium rounded-lg hover:bg-[#EFEBFF] transition-colors"
    onClick={onClick}
    aria-label="Add new link"
  >
    + Add New Link
  </button>
);

/**
 * LinksManager component handles adding, editing, removing and reordering link items
 */
const LinksManager: React.FC<LinksManagerProps> = ({
  onLinksChange,
  initialLinks = [],
}) => {
  const [links, setLinks] = useState<LinkItem[]>(initialLinks);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    // Fetch links from Supabase on component mount
    let isMounted = true;
    const fetchLinks = async () => {
      if (!user) {
        console.log("No user found, waiting for auth context to initialize...");
        if (isMounted) {
          setIsLoading(false);
          setLinks([]);
        }
        return;
      }

      setIsLoading(true);
      try {
        console.log("Attempting to fetch links for user:", user.id);
        const userLinks = await getUserLinks();

        // Only update state if component is still mounted
        if (isMounted) {
          const formattedLinks = userLinks.map((link) => ({
            id: link.id,
            platform: link.platform,
            url: link.url,
          }));

          setLinks(formattedLinks);
          onLinksChange(formattedLinks);
          setError(null);
        }
      } catch (error: any) {
        console.error("Error in LinksManager when fetching links:", error);
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
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchLinks();

    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isMounted = false;
    };
  }, [user?.id]); // Only re-run when user ID changes

  const addNewLink = async () => {
    const newLink = { platform: "GitHub", url: "" };
    setIsSaving(true);

    try {
      const createdLink = await createLink({
        platform: newLink.platform,
        url: newLink.url,
        title: newLink.platform, // Using platform name as title for now
      });

      if (createdLink) {
        const newLinkItem = {
          id: createdLink.id,
          platform: createdLink.platform,
          url: createdLink.url,
        };

        const newLinks = [...links, newLinkItem];
        setLinks(newLinks);
        onLinksChange(newLinks);
      }
    } catch (error) {
      console.error("Error creating link:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const removeLink = async (index: number) => {
    const linkToRemove = links[index];
    if (!linkToRemove.id) return;

    setIsSaving(true);

    try {
      const success = await deleteLink(linkToRemove.id);

      if (success) {
        const newLinks = [...links];
        newLinks.splice(index, 1);
        setLinks(newLinks);
        onLinksChange(newLinks);
      }
    } catch (error) {
      console.error("Error removing link:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateLinkItem = async (
    index: number,
    platform: string,
    url: string
  ) => {
    const linkToUpdate = links[index];
    if (!linkToUpdate.id) return;

    setIsSaving(true);

    try {
      const updatedLink = await updateLink(linkToUpdate.id, {
        platform,
        url,
        title: platform, // Using platform name as title for now
      });

      if (updatedLink) {
        const newLinks = [...links];
        newLinks[index] = {
          id: updatedLink.id,
          platform: updatedLink.platform,
          url: updatedLink.url,
        };
        setLinks(newLinks);
        onLinksChange(newLinks);
      }
    } catch (error) {
      console.error("Error updating link:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const reorderLinks = (dragIndex: number, hoverIndex: number) => {
    const newLinks = [...links];
    const draggedItem = newLinks[dragIndex];
    newLinks.splice(dragIndex, 1);
    newLinks.splice(hoverIndex, 0, draggedItem);
    setLinks(newLinks);
    onLinksChange(newLinks);
    // Note: We're not persisting the order to the database yet
    // That would require adding a 'position' field to our links table
  };

  const handleSave = async () => {
    setIsSaving(true);
    // This could be used to save all links in batch if needed
    // For now, we're saving each link individually when it's edited
    setTimeout(() => {
      setIsSaving(false);
      // You could show a success toast or notification here
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#633CFF]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col justify-center items-center h-64 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          className="px-4 py-2 bg-[#633CFF] text-white rounded-lg"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <header className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Customize your links</h2>
        <p className="text-gray-500">
          Add/edit/remove links below and then share all your profiles with the
          world!
        </p>
      </header>

      {links.length === 0 ? (
        <EmptyState onAddLink={addNewLink} />
      ) : (
        <>
          <AddLinkButton onClick={addNewLink} />

          <div className="mt-6 space-y-4">
            {links.map((link, index) => (
              <LinkCard
                key={link.id || index}
                platform={link.platform}
                url={link.url}
                index={index}
                onRemove={removeLink}
                onEdit={updateLinkItem}
                onReorder={reorderLinks}
              />
            ))}

            <div className="flex justify-end mt-6">
              <button
                className="btn-primary px-6 py-3 bg-[#633CFF] text-white rounded-lg hover:bg-[#5332D5] transition-colors disabled:bg-opacity-60 disabled:cursor-not-allowed"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LinksManager;
