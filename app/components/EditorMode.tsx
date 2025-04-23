import React, { useState } from "react";
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
}

const EditorMode: React.FC<EditorModeProps> = ({
  userProfile,
  links,
  onProfileUpdate,
  onLinksUpdate,
}) => {
  const [activeTab, setActiveTab] = useState("links");

  return (
    <div className="p-4 min-h-screen bg-[#FAFAFA] flex flex-col">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-grow bg-white rounded-xl shadow-sm p-4">
          <div className="tabs w-full mb-8">
            <button
              className={`tab ${activeTab === "links" ? "active" : ""}`}
              onClick={() => setActiveTab("links")}
            >
              <svg
                width="21"
                height="20"
                viewBox="0 0 21 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.6667 2.5H7.00004C6.07957 2.5 5.33337 3.24619 5.33337 4.16667V15.8333C5.33337 16.7538 6.07957 17.5 7.00004 17.5H13.6667C14.5872 17.5 15.3334 16.7538 15.3334 15.8333V4.16667C15.3334 3.24619 14.5872 2.5 13.6667 2.5Z"
                  stroke="#737373"
                  strokeWidth="1.5"
                />
                <rect
                  x="8.66669"
                  y="13.3333"
                  width="3.33333"
                  height="0.833333"
                  rx="0.416667"
                  fill="#737373"
                />
              </svg>
              Links
            </button>
            <button
              className={`tab ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <svg
                width="21"
                height="20"
                viewBox="0 0 21 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.5 10.8333C12.3407 10.8333 13.8333 9.34067 13.8333 7.5C13.8333 5.65933 12.3407 4.16667 10.5 4.16667C8.65934 4.16667 7.16668 5.65933 7.16668 7.5C7.16668 9.34067 8.65934 10.8333 10.5 10.8333Z"
                  stroke="#737373"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5.33332 17.5V16.6667C5.33332 15.7826 5.6845 14.9348 6.30962 14.3096C6.93474 13.6845 7.78253 13.3333 8.66666 13.3333H12.3333C13.2175 13.3333 14.0652 13.6845 14.6904 14.3096C15.3155 14.9348 15.6667 15.7826 15.6667 16.6667V17.5"
                  stroke="#737373"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Profile Details
            </button>
          </div>

          {activeTab === "links" ? (
            <LinksManager links={links} onChange={onLinksUpdate} />
          ) : (
            <ProfileCard
              firstName={userProfile.firstName}
              lastName={userProfile.lastName}
              email={userProfile.email}
              imageUrl={userProfile.imageUrl}
              onChange={onProfileUpdate}
            />
          )}
        </div>

        <div className="hidden lg:block lg:w-[560px]">
          <div className="sticky top-4">
            <PhonePreview
              firstName={userProfile.firstName}
              lastName={userProfile.lastName}
              email={userProfile.email}
              imageUrl={userProfile.imageUrl}
              links={links}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorMode;
