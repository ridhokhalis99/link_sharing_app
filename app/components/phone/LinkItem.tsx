import React from "react";
import { getPlatformStyle } from "../constants/platforms";
import ArrowRightIcon from "../icons/ArrowRightIcon";
import PlatformIcon, { PlatformType } from "../icons/platform/PlatformIcon";

interface LinkItemProps {
  platform: string;
  url: string;
}

const LinkItem: React.FC<LinkItemProps> = ({ platform, url }) => {
  const style = getPlatformStyle(platform);

  // Convert platform name to PlatformType if it matches one of our supported platforms
  const isPlatformSupported = (platform: string): platform is PlatformType => {
    const supportedPlatforms: PlatformType[] = [
      "Codepen",
      "Codewars",
      "DevTo",
      "Facebook",
      "FreeCodeCamp",
      "FrontendMentor",
      "GitHub",
      "Gitlab",
      "HashNode",
      "LinkedIn",
      "StackOverflow",
      "Twitch",
      "Twitter",
      "YouTube",
    ];
    return supportedPlatforms.includes(platform as PlatformType);
  };

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
      <div className="absolute left-4 flex items-center justify-center">
        {isPlatformSupported(platform) ? (
          <PlatformIcon name={platform as PlatformType} version="ori" />
        ) : (
          <img
            src={style.icon}
            alt={platform}
            className="w-5 h-5 filter brightness-0 invert"
          />
        )}
      </div>

      <span className="text-[16px] font-medium text-white absolute left-[44px]">
        {platform}
      </span>

      <div className="absolute right-4">
        <ArrowRightIcon />
      </div>
    </a>
  );
};

export default LinkItem;
