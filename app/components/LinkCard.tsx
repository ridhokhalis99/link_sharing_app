import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useDrag, useDrop } from "react-dnd";
import { getPlatformStyle, PlatformStyle } from "./constants/platforms";
import PlatformIcon from "./icons/platform/PlatformIcon";
import TextInput from "./TextInput";

// Define type for the drag item
interface DragItem {
  index: number;
  id: string;
  type: string;
}

interface LinkCardProps {
  platform: string;
  url: string;
  index: number;
  onRemove: (index: number) => void;
  onEdit: (index: number, platform: string, url: string) => void;
  onReorder: (dragIndex: number, hoverIndex: number) => void;
  isNew?: boolean;
  isModified?: boolean;
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

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Initialize refs array for menu items
  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, availablePlatforms.length);
  }, [availablePlatforms.length]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus management for dropdown
  useEffect(() => {
    if (isOpen) {
      if (focusedIndex >= 0 && itemRefs.current[focusedIndex]) {
        itemRefs.current[focusedIndex]?.focus();
      } else {
        // Focus first item when opening with keyboard
        setFocusedIndex(0);
      }
    } else {
      setFocusedIndex(-1);
    }
  }, [isOpen, focusedIndex]);

  const handlePlatformSelection = (platform: string) => {
    const event = {
      target: { value: platform },
    } as React.ChangeEvent<HTMLSelectElement>;
    onChange(event);
    setIsOpen(false);
    buttonRef.current?.focus(); // Return focus to button after selection
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        buttonRef.current?.focus();
        break;
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prevIndex) =>
          prevIndex < availablePlatforms.length - 1 ? prevIndex + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : availablePlatforms.length - 1
        );
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (focusedIndex >= 0) {
          handlePlatformSelection(availablePlatforms[focusedIndex]);
        }
        break;
      case "Tab":
        e.preventDefault(); // Prevent tab navigation while dropdown is open
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <label
        className="block text-sm font-medium text-gray-800 mb-1"
        id="platform-label"
      >
        Platform
      </label>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          ref={buttonRef}
          className={`flex items-center justify-between w-full p-3 rounded-lg border ${
            isOpen
              ? "border-[#633CFF] ring-2 ring-[#633CFF]/25"
              : "border-[#D9D9D9]"
          } bg-white focus:outline-none focus:border-[#633CFF] focus:ring-2 focus:ring-[#633CFF]/25 transition-all`}
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby="platform-label"
        >
          <div className="flex items-center gap-3">
            {value && (
              <div className="flex items-center justify-center w-5 h-5">
                <PlatformIcon name={value as any} version="mono" />
              </div>
            )}
            <span className="font-medium text-gray-800 leading-5">{value}</span>
          </div>
          <svg
            width="14"
            height="9"
            viewBox="0 0 14 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          >
            <path d="M1 1L7 7L13 1" stroke="#633CFF" strokeWidth="2" />
          </svg>
        </button>

        {isOpen && (
          <div
            ref={menuRef}
            className="absolute z-10 w-full mt-1 bg-white border border-[#D9D9D9] rounded-lg shadow-lg max-h-64 overflow-y-auto"
            role="listbox"
            aria-labelledby="platform-label"
            tabIndex={-1}
          >
            {availablePlatforms.map((platform, index) => (
              <button
                key={platform}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                className={`flex items-center w-full p-3 text-left transition-colors ${
                  focusedIndex === index
                    ? "bg-[#EFEBFF] outline-none"
                    : hoveredPlatform === platform
                    ? "bg-gray-100"
                    : ""
                }`}
                onClick={() => handlePlatformSelection(platform)}
                onMouseEnter={() => setHoveredPlatform(platform)}
                onMouseLeave={() => setHoveredPlatform(null)}
                onKeyDown={handleKeyDown}
                onFocus={() => setFocusedIndex(index)}
                role="option"
                aria-selected={value === platform}
                tabIndex={focusedIndex === index ? 0 : -1}
              >
                <div className="flex items-center justify-center w-5 h-5 mr-3">
                  <PlatformIcon
                    name={platform as any}
                    version="mono"
                    color={
                      focusedIndex === index || hoveredPlatform === platform
                        ? "#633CFF"
                        : undefined
                    }
                  />
                </div>
                <span
                  className={`font-medium leading-5 ${
                    focusedIndex === index || hoveredPlatform === platform
                      ? "text-[#633CFF]"
                      : "text-gray-800"
                  }`}
                >
                  {platform}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
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
  <TextInput
    id={`link-url-${platform}`}
    label="Link"
    type="url"
    value={value}
    onChange={onChange}
    placeholder={`e.g. https://${platform.toLowerCase()}.com/username`}
  />
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
  isNew,
  isModified,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // Setup drag source
  const [{ isDragging }, drag] = useDrag({
    type: "LINK_CARD",
    item: () => {
      return { index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Setup drop target
  const [{ handlerId }, drop] = useDrop({
    accept: "LINK_CARD",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: any, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      onReorder(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  // Connect drag and drop refs
  drag(drop(ref));

  const handlePlatformChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onEdit(index, e.target.value, url);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onEdit(index, platform, e.target.value);
  };

  const opacity = isDragging ? 0.4 : 1;

  return (
    <div
      ref={ref}
      className={`bg-[#FAFAFA] p-5 rounded-lg border ${
        isNew
          ? "border-green-400"
          : isModified
          ? "border-blue-400"
          : "border-[#D9D9D9]"
      } mb-4 relative cursor-move`}
      style={{ opacity }}
      data-handler-id={handlerId}
    >
      {(isNew || isModified) && (
        <div className="absolute top-2 right-2 z-10">
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              isNew
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {isNew ? "New" : "Modified"}
          </span>
        </div>
      )}

      <div className="flex justify-between items-center mb-4 cursor-move">
        <div className="flex items-center">
          <DragHandle />
          <span className="font-semibold text-gray-800">Link #{index + 1}</span>
        </div>
        <button
          onClick={() => onRemove(index)}
          className="text-gray-700 hover:text-red-600 transition-colors cursor-pointer"
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
