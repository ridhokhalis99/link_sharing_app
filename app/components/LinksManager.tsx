import React, { useState, useEffect } from "react";
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
  const [originalLinks, setOriginalLinks] = useState<LinkItem[]>([]);
  const [links, setLinks] = useState<LinkItem[]>(initialLinks);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [orderChanged, setOrderChanged] = useState<boolean>(false);
  const { user } = useAuth();

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
  }, [user?.id]);

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
    <div className="bg-white rounded-xl shadow-md">
      <header className="p-6 pb-0">
        <h2 className="text-2xl font-bold mb-2">Customize your links</h2>
        <p className="text-gray-500">
          Add/edit/remove links below and then share all your profiles with the
          world!
        </p>
      </header>

      <div className="p-6">
        {visibleLinks.length === 0 ? (
          <EmptyState onAddLink={addNewLink} />
        ) : (
          <>
            <AddLinkButton onClick={addNewLink} />

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
          </>
        )}
      </div>

      {visibleLinks.length > 0 && (
        <div className="border-t border-[#D9D9D9]">
          <div className="flex justify-end p-6">
            <button
              className={`px-6 py-3 rounded-lg ${
                hasUnsavedChanges
                  ? "bg-[#633CFF] text-white hover:bg-[#5332D5]"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              } transition-colors disabled:opacity-60`}
              onClick={handleSave}
              disabled={isSaving || !hasUnsavedChanges}
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
