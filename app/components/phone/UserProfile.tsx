import React from "react";
import Image from "next/image";
import UserAvatarIcon from "../icons/UserAvatarIcon";

interface UserProfileProps {
  name: string;
  email: string;
  imageUrl?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ name, email, imageUrl }) => {
  return (
    <div className="mt-8 mb-8 flex flex-col items-center">
      <div className="w-[96px] h-[96px] rounded-full mb-6 overflow-hidden border-[3px] border-[#633CFF]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            width={96}
            height={96}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#EFEBFF]">
            <UserAvatarIcon />
          </div>
        )}
      </div>
      <h2 className="text-[18px] font-semibold text-[#333333] mb-1">
        {name || "Your Name"}
      </h2>
      <p className="text-[14px] text-[#737373]">
        {email || "email@example.com"}
      </p>
    </div>
  );
};

export default UserProfile;
