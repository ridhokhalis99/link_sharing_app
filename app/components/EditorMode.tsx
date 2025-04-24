import React, { useState, useEffect } from "react";
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

  return (
    <div className="min-h-[calc(100vh-100px)] flex flex-col bg-[#f5f5f5]">
      <div className="flex flex-col lg:flex-row gap-6 px-6 py-4 max-w-[1392px] mx-auto w-full">
        {/* Phone Preview Section - Fixed height with scrolling */}
        <div className="lg:w-[560px] flex-shrink-0">
          <div className="sticky top-4 w-full h-[calc(100vh-120px)] overflow-auto">
            <PhonePreview
              firstName={userProfile.firstName}
              lastName={userProfile.lastName}
              email={userProfile.email}
              imageUrl={userProfile.imageUrl}
              links={links}
            />
          </div>
        </div>

        {/* Content Section - Fixed height with scrolling */}
        <div className="flex-1 h-[calc(100vh-120px)] overflow-auto">
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
