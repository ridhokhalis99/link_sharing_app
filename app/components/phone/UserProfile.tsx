import React from "react";
import Image from "next/image";
import UserAvatarIcon from "../icons/UserAvatarIcon";

interface UserProfileProps {
  firstName?: string;
  lastName?: string;
  email?: string;
  imageUrl?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({
  firstName,
  lastName,
  email,
  imageUrl,
}) => {
  const isEmpty = !firstName && !lastName && !email;
  const fullName =
    firstName && lastName
      ? `${firstName} ${lastName}`
      : firstName || lastName || "";

  return (
    <div className="mt-8 mb-8 flex flex-col items-center">
      {imageUrl ? (
        <div className="w-[96px] h-[96px] rounded-full mb-6 overflow-hidden border-[3px] border-[#633CFF]">
          <Image
            src={imageUrl}
            alt={fullName || "Profile"}
            width={96}
            height={96}
            className="object-cover w-full h-full"
          />
        </div>
      ) : (
        <div className="w-[96px] h-[96px] rounded-full mb-6 bg-[#f2f2f2] animate-pulse"></div>
      )}

      {isEmpty ? (
        <>
          <div className="h-[18px] w-[150px] bg-[#f2f2f2] rounded-full mb-3"></div>
          <div className="h-[14px] w-[100px] bg-[#f2f2f2] rounded-full"></div>
        </>
      ) : (
        <>
          <h2 className="text-[18px] font-semibold text-[#333333] mb-1">
            {fullName || "Your Name"}
          </h2>
          <p className="text-[14px] text-[#737373]">
            {email || "email@example.com"}
          </p>
        </>
      )}
    </div>
  );
};

export default UserProfile;
