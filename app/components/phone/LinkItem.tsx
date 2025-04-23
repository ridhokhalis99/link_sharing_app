import React from "react";
import { getPlatformStyle } from "../constants/platforms";
import {
  ArrowRightIcon,
  getIconComponent,
} from "../icons/PlatformIconsPreviewButtons";

interface LinkItemProps {
  platform: string;
  url: string;
}

const LinkItem: React.FC<LinkItemProps> = ({ platform, url }) => {
  const style = getPlatformStyle(platform);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="relative block h-[44px] rounded-[8px] flex items-center w-full mx-auto transition-transform hover:translate-y-[-2px]"
      style={{
        backgroundColor: style.bgColor,
      }}
    >
      {/* Platform Icon */}
      <div className="absolute left-4 flex items-center justify-center">
        {getIconComponent(platform) || (
          <img
            src={style.icon}
            alt={platform}
            className="w-5 h-5 filter brightness-0 invert"
          />
        )}
      </div>

      {/* Platform Name */}
      <span className="text-[16px] font-medium text-white absolute left-[44px]">
        {platform}
      </span>

      {/* Arrow Icon */}
      <div className="absolute right-4">
        <ArrowRightIcon />
      </div>
    </a>
  );
};

export default LinkItem;
