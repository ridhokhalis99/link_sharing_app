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
    <div className="min-h-screen bg-gray-100">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onPreviewClick={onPreviewClick}
      />
      <main className="container mx-auto px-4 py-8 max-w-5xl">{children}</main>
    </div>
  );
};

export default MainLayout;
