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
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);

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

  // Sync heights between sections
  useEffect(() => {
    const syncHeights = () => {
      if (contentRef.current && phoneContainerRef.current) {
        const phoneHeight = phoneContainerRef.current.scrollHeight;
        const contentHeight = contentRef.current.scrollHeight;

        // Use the taller of the two heights for both containers
        const maxHeight = Math.max(phoneHeight, contentHeight);
        setContainerHeight(maxHeight);
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

    if (phoneContainerRef.current) {
      resizeObserver.observe(phoneContainerRef.current);
    }

    // Sync heights when tab changes, links update, or on window resize
    window.addEventListener("resize", syncHeights);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      window.removeEventListener("resize", syncHeights);
    };
  }, [activeTab, links.length]);

  return (
    <div className="min-h-[calc(100vh-100px)] flex flex-col bg-[#f5f5f5]">
      <div
        ref={containerRef}
        className="flex flex-col lg:flex-row gap-6 px-6 py-4 max-w-[1392px] mx-auto w-full"
      >
        <div
          className="lg:w-[560px] flex-shrink-0 flex"
          ref={phoneContainerRef}
          style={{
            minHeight: containerHeight ? `${containerHeight}px` : "auto",
          }}
        >
          <div className="sticky top-4 w-full">
            <PhonePreview
              firstName={userProfile.firstName}
              lastName={userProfile.lastName}
              email={userProfile.email}
              imageUrl={userProfile.imageUrl}
              links={links}
            />
          </div>
        </div>

        <div
          className="flex-1"
          ref={contentRef}
          style={{
            minHeight: containerHeight ? `${containerHeight}px` : "auto",
          }}
        >
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
