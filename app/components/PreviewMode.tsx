import React from "react";
import PhonePreview from "./PhonePreview";

interface PreviewModeProps {
  onBackClick: () => void;
  userProfile: {
    firstName: string;
    lastName: string;
    email: string;
    imageUrl: string;
  };
  links: Array<{
    id?: string;
    platform: string;
    url: string;
    order?: number;
  }>;
}

const PreviewMode: React.FC<PreviewModeProps> = ({
  onBackClick,
  userProfile,
  links,
}) => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] p-4 flex flex-col">
      <header className="bg-white rounded-xl shadow-sm p-4 mb-6 flex justify-between items-center">
        <button
          onClick={onBackClick}
          className="btn-secondary flex items-center gap-2"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 12L6 8L10 4"
              stroke="#633CFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Editor
        </button>
        <button className="btn-primary">Share Link</button>
      </header>

      <div className="flex-grow flex items-center justify-center">
        <PhonePreview
          firstName={userProfile.firstName}
          lastName={userProfile.lastName}
          email={userProfile.email}
          imageUrl={userProfile.imageUrl}
          links={links}
        />
      </div>
    </div>
  );
};

export default PreviewMode;
