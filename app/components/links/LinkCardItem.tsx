import React, { useRef } from "react";
import { useDrag, useDrop, DropTargetMonitor } from "react-dnd";
import PlatformIcon, { PlatformType } from "../icons/platform/PlatformIcon";
import { LinkItem } from "../../hooks/useLinksManager";

interface LinkCardItemProps {
  link: LinkItem;
  index: number;
  onRemove: (index: number) => void;
  onUpdate: (index: number, platform: string, url: string) => void;
  onReorder: (dragIndex: number, hoverIndex: number) => void;
  platformOptions: string[];
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

/**
 * Component for a single link card with drag-and-drop functionality
 */
export const LinkCardItem = ({
  link,
  index,
  onRemove,
  onUpdate,
  onReorder,
  platformOptions,
}: LinkCardItemProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: string | symbol | null }>({
    accept: "LINK_CARD",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      onReorder(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag<DragItem, unknown, { isDragging: boolean }>({
    type: "LINK_CARD",
    item: () => {
      return { id: link.id || String(index), index, type: "LINK_CARD" };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;
  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{ opacity }}
      data-handler-id={handlerId}
      className="bg-[#FAFAFA] rounded-lg mb-6 p-5 border border-gray-200"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="cursor-move mr-2">
            <svg
              width="12"
              height="6"
              viewBox="0 0 12 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="12" height="1" fill="#737373" />
              <rect y="2.5" width="12" height="1" fill="#737373" />
              <rect y="5" width="12" height="1" fill="#737373" />
            </svg>
          </div>
          <h3 className="text-[#737373] font-bold">Link #{index + 1}</h3>
        </div>
        <button
          onClick={() => onRemove(index)}
          className="text-[#737373] hover:text-red-500"
        >
          Remove
        </button>
      </div>

      <div className="mb-3">
        <label className="block text-[#737373] text-xs mb-1">Platform</label>
        <div className="relative">
          <select
            value={link.platform}
            onChange={(e) => onUpdate(index, e.target.value, link.url)}
            className="w-full py-3 px-4 border border-[#D9D9D9] rounded-lg bg-white appearance-none pr-8"
          >
            {platformOptions.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg
              width="14"
              height="9"
              viewBox="0 0 14 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1 1L7 7L13 1" stroke="#737373" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-[#737373] text-xs mb-1">Link</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4">
            <PlatformIcon
              name={link.platform as PlatformType}
              className="h-5 w-5 text-[#737373]"
            />
          </div>
          <input
            type="url"
            value={link.url}
            onChange={(e) => onUpdate(index, link.platform, e.target.value)}
            placeholder={`Enter ${link.platform} link`}
            className="w-full py-3 pl-11 pr-4 border border-[#D9D9D9] rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};
