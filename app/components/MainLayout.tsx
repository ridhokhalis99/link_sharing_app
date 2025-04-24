import React, { ReactNode } from "react";
import Header from "./Header";

interface MainLayoutProps {
  children: ReactNode;
  activeTab: "links" | "profile";
  setActiveTab: (tab: "links" | "profile") => void;
  onPreviewClick: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  activeTab,
  setActiveTab,
  onPreviewClick,
}) => {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="max-w-[1392px] mx-auto px-4 py-3">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onPreviewClick={onPreviewClick}
        />
      </div>
      <main className="pb-16">{children}</main>
    </div>
  );
};

export default MainLayout;
