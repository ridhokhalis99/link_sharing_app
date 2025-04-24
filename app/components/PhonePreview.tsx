import React from "react";
import PhoneFrame from "./phone/PhoneFrame";
import UserProfile from "./phone/UserProfile";
import LinksList from "./phone/LinksList";

export interface LinkItem {
  platform: string;
  url: string;
}

interface PhonePreviewProps {
  firstName?: string;
  lastName?: string;
  email?: string;
  imageUrl?: string;
  links: LinkItem[];
}

/**
 * PhonePreview component displays a mobile phone preview with user profile and links
 *
 * @param firstName - User's first name
 * @param lastName - User's last name
 * @param email - User's email address
 * @param imageUrl - Optional URL to user's profile image
 * @param links - Array of platform links to display
 */
const PhonePreview: React.FC<PhonePreviewProps> = ({
  firstName,
  lastName,
  email,
  imageUrl,
  links,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm h-full flex flex-col justify-start items-center overflow-auto">
      <PhoneFrame>
        <div className="flex flex-col items-center overflow-auto h-[540px] pb-4 custom-scrollbar">
          <UserProfile
            firstName={firstName}
            lastName={lastName}
            email={email}
            imageUrl={imageUrl}
          />
          <LinksList links={links} maxLinks={5} />
        </div>
      </PhoneFrame>

      {/* Custom scrollbar styling */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 2px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #d9d9d9;
          border-radius: 20px;
        }

        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #d9d9d9 transparent;
        }
      `}</style>
    </div>
  );
};

export default PhonePreview;
