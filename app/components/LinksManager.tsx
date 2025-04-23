import React, { useState } from "react";
import LinkCard from "./LinkCard";

export interface LinkItem {
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

  const addNewLink = () => {
    const newLinks = [...links, { platform: "GitHub", url: "" }];
    setLinks(newLinks);
    onLinksChange(newLinks);
  };

  const removeLink = (index: number) => {
    const newLinks = [...links];
    newLinks.splice(index, 1);
    setLinks(newLinks);
    onLinksChange(newLinks);
  };

  const updateLink = (index: number, platform: string, url: string) => {
    const newLinks = [...links];
    newLinks[index] = { platform, url };
    setLinks(newLinks);
    onLinksChange(newLinks);
  };

  const reorderLinks = (dragIndex: number, hoverIndex: number) => {
    const newLinks = [...links];
    const draggedItem = newLinks[dragIndex];
    newLinks.splice(dragIndex, 1);
    newLinks.splice(hoverIndex, 0, draggedItem);
    setLinks(newLinks);
    onLinksChange(newLinks);
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call or saving process
    setTimeout(() => {
      setIsSaving(false);
      // You could show a success toast or notification here
    }, 1000);
  };

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
                key={index}
                platform={link.platform}
                url={link.url}
                index={index}
                onRemove={removeLink}
                onEdit={updateLink}
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
