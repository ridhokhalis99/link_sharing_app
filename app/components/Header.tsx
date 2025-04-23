import React from "react";
import LinkIcon from "./icons/LinkIcon";
import ProfileIcon from "./icons/ProfileIcon";
import LogoIcon from "./icons/LogoIcon";

interface HeaderProps {
  activeTab: "links" | "profile";
  setActiveTab: (tab: "links" | "profile") => void;
  onPreviewClick: () => void;
}

const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onPreviewClick,
}) => {
  return (
    <nav className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap justify-between items-center">
      <div className="flex items-center gap-2">
        <LogoIcon />
        <h1 className="text-2xl font-bold text-[#333333]">devlinks</h1>
      </div>
      <div className="flex gap-2 md:gap-4">
        <button
          onClick={() => setActiveTab("links")}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer ${
            activeTab === "links"
              ? "bg-[#EFEBFF] text-[#633CFF] font-medium"
              : "text-[#737373] font-normal"
          }`}
        >
          <LinkIcon
            className="w-5 h-5"
            color={activeTab === "links" ? "#633CFF" : "#737373"}
          />
          Links
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer ${
            activeTab === "profile"
              ? "bg-[#EFEBFF] text-[#633CFF] font-medium"
              : "text-[#737373] font-normal"
          }`}
        >
          <ProfileIcon
            className="w-5 h-5"
            color={activeTab === "profile" ? "#633CFF" : "#737373"}
          />
          Profile Details
        </button>
      </div>
      <button
        onClick={onPreviewClick}
        className="btn-secondary border border-[#633CFF] bg-white"
      >
        Preview
      </button>
    </nav>
  );
};

export default Header;
