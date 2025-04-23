import React, { useState } from 'react';
import LinkCard from './LinkCard';

interface LinkItem {
  platform: string;
  url: string;
}

interface LinksManagerProps {
  onLinksChange: (links: LinkItem[]) => void;
  initialLinks?: LinkItem[];
}

const LinksManager: React.FC<LinksManagerProps> = ({ 
  onLinksChange,
  initialLinks = []
}) => {
  const [links, setLinks] = useState<LinkItem[]>(initialLinks);

  const addNewLink = () => {
    const newLinks = [...links, { platform: 'GitHub', url: '' }];
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

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-2">Customize your links</h2>
      <p className="text-gray-500 mb-6">
        Add/edit/remove links below and then share all your profiles with the world!
      </p>

      <button 
        className="btn-secondary w-full mb-6"
        onClick={addNewLink}
      >
        + Add New Link
      </button>

      {links.length === 0 ? (
        <div className="bg-[#FAFAFA] rounded-lg p-6 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 mb-4 flex items-center justify-center">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M40 68.3333C55.6917 68.3333 68.3333 55.6917 68.3333 40C68.3333 24.3083 55.6917 11.6667 40 11.6667C24.3083 11.6667 11.6667 24.3083 11.6667 40C11.6667 55.6917 24.3083 68.3333 40 68.3333Z" stroke="#633CFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M26.6667 40H53.3333" stroke="#633CFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M40 26.6667V53.3333" stroke="#633CFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-4">Let's get you started</h3>
          <p className="text-gray-500">
            Use the "Add New Link" button to get started. Once you have more than
            one link, you can reorder and edit them. We're here to help you share
            your profiles with everyone!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
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
            <button className="btn-primary">
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinksManager;