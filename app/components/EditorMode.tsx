import React, { useState, useEffect, useRef } from "react";
import LinksManager from "./LinksManager";
import ProfileCard from "./ProfileCard";
import PhonePreview from "./PhonePreview";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string;
}

interface Link {
  id?: string;
  platform: string;
  url: string;
  order?: number;
}

interface EditorModeProps {
  userProfile: UserProfile;
  links: Array<Link>;
  onProfileUpdate: (data: UserProfile) => void;
  onLinksUpdate: (links: Array<Link>) => void;
  activeTab: "links" | "profile";
}

const EditorMode: React.FC<EditorModeProps> = ({
  userProfile,
  links,
  onProfileUpdate,
  onLinksUpdate,
  activeTab,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const phoneContainerRef = useRef<HTMLDivElement>(null);

  // Create a wrapper function that converts partial updates to full UserProfile updates
  const handleProfileUpdate = (data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    imageUrl?: string;
  }) => {
    // Merge the partial update with the current profile data
    const updatedProfile: UserProfile = {
      ...userProfile,
      ...data,
    };
    onProfileUpdate(updatedProfile);
  };

  // Sync heights between content and phone container
  useEffect(() => {
    const syncHeights = () => {
      if (contentRef.current && phoneContainerRef.current) {
        const contentHeight = contentRef.current.getBoundingClientRect().height;
        phoneContainerRef.current.style.height = `${contentHeight}px`;
      }
    };

    // Initial sync after render
    const timer = setTimeout(syncHeights, 100);

    // Create a ResizeObserver to watch for content height changes
    const resizeObserver = new ResizeObserver(() => {
      syncHeights();
    });

    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    // Sync heights when tab changes or links update
    window.addEventListener("resize", syncHeights);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      window.removeEventListener("resize", syncHeights);
    };
  }, [activeTab, links.length]);

  return (
    <div className="min-h-[calc(100vh-100px)] flex flex-col bg-[#f5f5f5]">
      <div className="flex flex-col lg:flex-row gap-6 px-6 py-4 max-w-[1392px] mx-auto w-full">
        <div className="lg:w-[560px] flex-shrink-0" ref={phoneContainerRef}>
          <div className="sticky top-4 h-full">
            <PhonePreview
              firstName={userProfile.firstName}
              lastName={userProfile.lastName}
              email={userProfile.email}
              imageUrl={userProfile.imageUrl}
              links={links}
            />
          </div>
        </div>

        <div className="flex-1" ref={contentRef}>
          {activeTab === "links" ? (
            <LinksManager initialLinks={links} onLinksChange={onLinksUpdate} />
          ) : (
            <ProfileCard
              firstName={userProfile.firstName}
              lastName={userProfile.lastName}
              email={userProfile.email}
              imageUrl={userProfile.imageUrl}
              onUpdate={handleProfileUpdate}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorMode;
