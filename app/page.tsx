"use client";

import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import MainLayout from "./components/MainLayout";
import EditorMode from "./components/EditorMode";
import PreviewMode from "./components/PreviewMode";
import { useUserData } from "./hooks/useUserData";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"links" | "profile">("links");
  const [isPreview, setIsPreview] = useState(false);

  const {
    userProfile,
    links,
    isLoading,
    handleProfileUpdate,
    handleLinksChange,
  } = useUserData();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (isPreview) {
    return (
      <PreviewMode
        onBackClick={() => setIsPreview(false)}
        userProfile={userProfile}
        links={links}
      />
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <MainLayout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onPreviewClick={() => setIsPreview(true)}
      >
        <EditorMode
          activeTab={activeTab}
          userProfile={userProfile}
          links={links}
          onProfileUpdate={handleProfileUpdate}
          onLinksUpdate={handleLinksChange}
        />
      </MainLayout>
    </DndProvider>
  );
}
