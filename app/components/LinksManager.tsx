import React, { useState, useEffect } from "react";
import Image from "next/image";
import LinkCard from "./LinkCard";
import {
  getUserLinks,
  createLink,
  updateLink,
  deleteLink,
  updateLinksOrder,
} from "../lib/links";
import { Link } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export interface LinkItem {
  id?: string;
  platform: string;
  url: string;
  order?: number;
  isNew?: boolean;
  isModified?: boolean;
  isDeleted?: boolean;
  isReordered?: boolean;
}

interface LinksManagerProps {
  onLinksChange: (links: LinkItem[]) => void;
  initialLinks?: LinkItem[];
}

/**
 * EmptyState component for when no links are present
 */
const EmptyState: React.FC<{ onAddLink: () => void }> = ({ onAddLink }) => (
  <div className="bg-[#FAFAFA] rounded-lg p-10 flex flex-col items-center justify-center text-center">
    <div className="w-[250px] h-[160px] mb-10 flex items-center justify-center">
      <Image
        src="/empty-link.svg"
        alt="Empty links illustration"
        width={250}
        height={160}
        priority
      />
    </div>
    <h3 className="text-[#333333] text-2xl font-bold mb-6">
      Let's get you started
    </h3>
    <p className="text-[#737373] mb-6 max-w-md">
      Use the "Add new link" button to get started. Once you have more than one
      link, you can reorder and edit them. We're here to help you share your
      profiles with everyone!
    </p>
    <button
      className="btn-primary px-8 py-3 bg-[#633CFF] text-white rounded-lg hover:bg-[#5332D5] transition-colors"
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
    className="w-full py-3 border border-[#633CFF] text-[#633CFF] font-medium rounded-lg hover:bg-[#EFEBFF] transition-colors bg-[#EFEBFF] flex justify-center items-center"
    onClick={onClick}
    aria-label="Add new link"
  >
    + Add new link
  </button>
);

/**
 * LinksManager component handles adding, editing, removing and reordering link items
 */
const LinksManager: React.FC<LinksManagerProps> = ({
  onLinksChange,
  initialLinks = [],
}) => {
  const { user } = useAuth();
  const [originalLinks, setOriginalLinks] = useState<LinkItem[]>(initialLinks);
  const [links, setLinks] = useState<LinkItem[]>(initialLinks);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(
    initialLinks.length === 0
  );
  const [error, setError] = useState<string | null>(null);
  const [orderChanged, setOrderChanged] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    // If we already have initialLinks, don't fetch again
    if (initialLinks.length > 0) {
      return;
    }

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
  }, [user?.id]); // Removed initialLinks dependency to prevent refetching

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
    onLinksChange(newLinks);
  };

  const removeLink = (index: number) => {
    const linkToRemove = links[index];
    
    // Special case: if this is the only link and it's new
    if (links.length === 1 && linkToRemove.isNew) {
      setLinks([]);
      onLinksChange([]);
      return;
    }

    if (linkToRemove.isNew) {
      const newLinks = [...links];
      newLinks.splice(index, 1);
      setLinks(newLinks);
      onLinksChange(newLinks);
    } else {
      const newLinks = [...links];
      newLinks[index] = {
        ...linkToRemove,
        isDeleted: true,
      };
      setLinks(newLinks);
      // Pass the filtered links to ensure the parent components get the correct visible links
      onLinksChange(newLinks.filter((link) => !link.isDeleted));
    }
  };

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
    onLinksChange(newLinks.filter((link) => !link.isDeleted));
  };

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
    onLinksChange(reorderedLinks.filter((link) => !link.isDeleted));
    setOrderChanged(true);
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const savePromises: Promise<any>[] = [];

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

      const deletedLinks = links.filter(
        (link) => link.isDeleted && !link.isNew && link.id
      );
      for (const link of deletedLinks) {
        if (link.id) {
          savePromises.push(deleteLink(link.id));
        }
      }

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

      // If all links were deleted, set empty arrays instead of fetching
      const allLinksDeleted = links.every(
        (link) => link.isDeleted || (link.isNew && link.isDeleted)
      );
      if (allLinksDeleted) {
        setOriginalLinks([]);
        setLinks([]);
        onLinksChange([]);
        setOrderChanged(false);
      } else {
        // Otherwise refresh links from server
        const updatedLinks = await getUserLinks();
        const formattedLinks = updatedLinks.map((link) => ({
          id: link.id,
          platform: link.platform,
          url: link.url,
          order: link.order,
        }));

        setOriginalLinks(formattedLinks);
        setLinks(formattedLinks);
        onLinksChange(formattedLinks);
        setOrderChanged(false);
      }

      console.log("All changes saved successfully");
    } catch (error) {
      console.error("Error saving changes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const visibleLinks = links.filter((link) => !link.isDeleted);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#633CFF]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-center">
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

  const hasUnsavedChanges =
    links.some(
      (link) =>
        link.isNew || link.isModified || link.isDeleted || link.isReordered
    ) || orderChanged;

  return (
    <div className="bg-white rounded-xl shadow-md flex flex-col h-full">
      <header className="p-6 pb-0 sticky top-0 bg-white z-10">
        <h2 className="text-2xl font-bold mb-2">Customize your links</h2>
        <p className="text-gray-500">
          Add/edit/remove links below and then share all your profiles with the
          world!
        </p>
      </header>

      <div className="p-6 flex-1 overflow-y-auto">
        {/* Always show the Add New Link button */}
        <AddLinkButton onClick={addNewLink} />

        {/* Show empty state only when there are no links to begin with */}
        {visibleLinks.length === 0 && links.length === 0 ? (
          <div className="mt-6">
            <EmptyState onAddLink={addNewLink} />
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {visibleLinks.map((link, index) => (
              <LinkCard
                key={link.id || index}
                platform={link.platform}
                url={link.url}
                index={index}
                onRemove={removeLink}
                onEdit={updateLinkItem}
                onReorder={reorderLinks}
                isNew={link.isNew}
                isModified={link.isModified}
              />
            ))}
          </div>
        )}
      </div>

      {/* Show the Save button when there are unsaved changes, regardless of whether there are visible links */}
      {hasUnsavedChanges && (
        <div className="border-t border-[#D9D9D9] sticky bottom-0 bg-white z-10">
          <div className="flex justify-end p-6">
            <button
              className="px-6 py-3 rounded-lg bg-[#633CFF] text-white hover:bg-[#5332D5] transition-colors disabled:opacity-60"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <span className="inline-block mr-2">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </span>
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinksManager;
