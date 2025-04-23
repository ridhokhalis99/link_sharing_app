import React from "react";
import Image from "next/image";

interface LinkCardProps {
  platform: string;
  url: string;
  index: number;
  onRemove: (index: number) => void;
  onEdit: (index: number, platform: string, url: string) => void;
  onReorder: (dragIndex: number, hoverIndex: number) => void;
}

const platformIcons: Record<string, { icon: string; color: string }> = {
  GitHub: { icon: "/github.svg", color: "#333333" },
  Twitter: { icon: "/twitter.svg", color: "#1DA1F2" },
  LinkedIn: { icon: "/linkedin.svg", color: "#0077B5" },
  Facebook: { icon: "/facebook.svg", color: "#1877F2" },
  Instagram: { icon: "/instagram.svg", color: "#E4405F" },
  YouTube: { icon: "/youtube.svg", color: "#FF0000" },
  Default: { icon: "/globe.svg", color: "#633CFF" },
};

const LinkCard: React.FC<LinkCardProps> = ({
  platform,
  url,
  index,
  onRemove,
  onEdit,
  onReorder,
}) => {
  const { icon, color } = platformIcons[platform] || platformIcons.Default;

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
          <div className="w-6 h-6 mr-2 cursor-move">
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
          <span className="font-semibold text-gray-800">Link #{index + 1}</span>
        </div>
        <button
          onClick={() => onRemove(index)}
          className="text-gray-700 hover:text-gray-900"
        >
          Remove
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Platform
          </label>
          <select
            className="input"
            value={platform}
            onChange={handlePlatformChange}
          >
            {Object.keys(platformIcons).map((p) => {
              if (p === "Default") return null;
              return (
                <option key={p} value={p}>
                  {p}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Link
          </label>
          <input
            type="url"
            className="input"
            value={url}
            onChange={handleUrlChange}
            placeholder={`e.g. https://${platform.toLowerCase()}.com/username`}
          />
        </div>
      </div>
    </div>
  );
};

export default LinkCard;
