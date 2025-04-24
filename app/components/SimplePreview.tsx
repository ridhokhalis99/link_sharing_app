// filepath: /Users/ridhokhalis/Documents/Code/link_sharing_app/app/components/SimplePreview.tsx
import React from "react";
import UserProfile from "./phone/UserProfile";
import LinksList from "./phone/LinksList";

export interface LinkItem {
  platform: string;
  url: string;
}

interface SimplePreviewProps {
  firstName?: string;
  lastName?: string;
  email?: string;
  imageUrl?: string;
  links: LinkItem[];
}

/**
 * SimplePreview component displays user profile and links in a simple white box
 * based on the Figma design
 *
 * @param firstName - User's first name
 * @param lastName - User's last name
 * @param email - User's email address
 * @param imageUrl - Optional URL to user's profile image
 * @param links - Array of platform links to display
 */
const SimplePreview: React.FC<SimplePreviewProps> = ({
  firstName,
  lastName,
  email,
  imageUrl,
  links,
}) => {
  return (
    <div className="bg-white p-12 rounded-3xl shadow-lg max-w-[350px] w-full">
      <div className="flex flex-col items-center gap-14">
        <UserProfile
          firstName={firstName}
          lastName={lastName}
          email={email}
          imageUrl={imageUrl}
        />
        <LinksList links={links} maxLinks={5} showEmptyPlaceholders={false} />
      </div>
    </div>
  );
};

export default SimplePreview;
