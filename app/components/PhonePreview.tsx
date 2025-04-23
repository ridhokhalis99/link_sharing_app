import React from "react";
import PhoneFrame from "./phone/PhoneFrame";
import UserProfile from "./phone/UserProfile";
import LinksList from "./phone/LinksList";

export interface LinkItem {
  platform: string;
  url: string;
}

interface PhonePreviewProps {
  name: string;
  email: string;
  imageUrl?: string;
  links: LinkItem[];
}

/**
 * PhonePreview component displays a mobile phone preview with user profile and links
 *
 * @param name - User's display name
 * @param email - User's email address
 * @param imageUrl - Optional URL to user's profile image
 * @param links - Array of platform links to display
 */
const PhonePreview: React.FC<PhonePreviewProps> = ({
  name,
  email,
  imageUrl,
  links,
}) => {
  return (
    <PhoneFrame>
      <div className="flex flex-col items-center">
        <UserProfile name={name} email={email} imageUrl={imageUrl} />
        <LinksList links={links} maxLinks={5} />
      </div>
    </PhoneFrame>
  );
};

export default PhonePreview;
