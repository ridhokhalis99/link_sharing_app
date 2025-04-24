import React from "react";
import LinkItem from "./LinkItem";

export interface LinkItemType {
  platform: string;
  url: string;
}

interface LinksListProps {
  links: LinkItemType[];
  maxLinks?: number;
  showEmptyPlaceholders?: boolean;
}

const LinksList: React.FC<LinksListProps> = ({
  links,
  maxLinks = 5,
  showEmptyPlaceholders = true,
}) => {
  // Calculate how many empty boxes to show
  const emptyBoxesCount = Math.max(0, maxLinks - (links?.length || 0));

  return (
    <div className="w-full space-y-4">
      {/* Render actual links */}
      {links &&
        links.length > 0 &&
        links.map((link, index) => (
          <div key={`link-${index}`} className="w-[237px] mx-auto">
            <LinkItem platform={link.platform} url={link.url} />
          </div>
        ))}

      {/* Render empty placeholder boxes only if showEmptyPlaceholders is true */}
      {showEmptyPlaceholders && emptyBoxesCount > 0 && (
        <>
          {Array.from({ length: emptyBoxesCount }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="w-[237px] h-[44px] rounded-[8px] bg-[#f2f2f2] mx-auto"
            />
          ))}
        </>
      )}
    </div>
  );
};

export default LinksList;
