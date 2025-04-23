import React from "react";
import Image from "next/image";
import { getPlatformStyle, PlatformStyle } from "./constants/platforms";

interface LinkCardProps {
  platform: string;
  url: string;
  index: number;
  onRemove: (index: number) => void;
  onEdit: (index: number, platform: string, url: string) => void;
  onReorder?: (dragIndex: number, hoverIndex: number) => void;
}

/**
 * DragHandle component for reordering links
 */
const DragHandle: React.FC = () => (
  <div className="w-6 h-6 mr-2 cursor-move flex items-center justify-center">
    <svg
      width="12"
      height="6"
      viewBox="0 0 12 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect y="0" width="12" height="2" rx="1" fill="#737373" />
      <rect y="4" width="12" height="2" rx="1" fill="#737373" />
    </svg>
  </div>
);

/**
 * PlatformSelector component for selecting platform
 */
const PlatformSelector: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}> = ({ value, onChange }) => {
  // Get all available platforms (excluding Default)
  const availablePlatforms = [
    "GitHub",
    "YouTube",
    "LinkedIn",
    "Facebook",
    "Twitter",
    "Instagram",
    "Codepen",
    "Codewars",
    "DevTo",
    "FreeCodeCamp",
    "FrontendMentor",
    "Gitlab",
    "HashNode",
    "StackOverflow",
    "Twitch",
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-800 mb-1">
        Platform
      </label>
      <select
        className="input w-full p-3 rounded-lg border border-[#D9D9D9]"
        value={value}
        onChange={onChange}
      >
        {availablePlatforms.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
    </div>
  );
};

/**
 * UrlInput component for entering URLs
 */
const UrlInput: React.FC<{
  value: string;
  platform: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ value, platform, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-800 mb-1">Link</label>
    <input
      type="url"
      className="input w-full p-3 rounded-lg border border-[#D9D9D9]"
      value={value}
      onChange={onChange}
      placeholder={`e.g. https://${platform.toLowerCase()}.com/username`}
    />
  </div>
);

/**
 * LinkCard component for managing individual link entries
 */
const LinkCard: React.FC<LinkCardProps> = ({
  platform,
  url,
  index,
  onRemove,
  onEdit,
  onReorder,
}) => {
  const handlePlatformChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onEdit(index, e.target.value, url);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onEdit(index, platform, e.target.value);
  };

  return (
    <div className="bg-[#FAFAFA] p-5 rounded-lg border border-[#D9D9D9] mb-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <DragHandle />
          <span className="font-semibold text-gray-800">Link #{index + 1}</span>
        </div>
        <button
          onClick={() => onRemove(index)}
          className="text-gray-700 hover:text-red-600 transition-colors"
          aria-label="Remove link"
        >
          Remove
        </button>
      </div>

      <div className="space-y-3">
        <PlatformSelector value={platform} onChange={handlePlatformChange} />
        <UrlInput value={url} platform={platform} onChange={handleUrlChange} />
      </div>
    </div>
  );
};

export default LinkCard;
