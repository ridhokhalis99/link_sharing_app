import React from "react";
import Image from "next/image";

interface ProfileCardProps {
  firstName: string;
  lastName: string;
  email: string;
  imageUrl?: string;
  onUpdate: (data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    imageUrl?: string;
  }) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  firstName,
  lastName,
  email,
  imageUrl,
  onUpdate,
}) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // In a real app, you'd upload the file to a server
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpdate({ imageUrl: event.target.result as string });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-[32px] font-bold mb-2 text-[#333333]">
        Profile Details
      </h2>
      <p className="text-[#737373] mb-10">
        Add your details to create a personal touch to your profile.
      </p>

      {/* Profile Picture */}
      <div className="bg-[#FAFAFA] p-5 rounded-xl mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <label className="text-[#737373] font-medium mb-4 md:mb-0">
            Profile picture
          </label>

          <div className="md:flex md:items-center gap-6">
            <div className="w-[193px] h-[193px] bg-[#EFEBFF] rounded-xl flex flex-col items-center justify-center relative overflow-hidden mb-6 md:mb-0">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="Profile"
                  width={193}
                  height={193}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M26.6667 20H13.3333"
                      stroke="#633CFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M20 13.3333L20 26.6666"
                      stroke="#633CFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="text-[#633CFF] font-semibold mt-2 text-sm">
                    + Upload Image
                  </span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleImageUpload}
              />
            </div>

            <div className="text-[#737373] text-xs">
              Image must be below 1024x1024px.
              <br />
              Use PNG or JPG format.
            </div>
          </div>
        </div>
      </div>

      {/* Form Fields - All in one container */}
      <div className="bg-[#FAFAFA] p-5 rounded-xl">
        {/* First Name */}
        <div className="mb-6">
          <label
            htmlFor="firstName"
            className="block text-[#737373] font-medium mb-1"
          >
            First name*
          </label>
          <input
            id="firstName"
            type="text"
            className="w-full px-4 py-3 border border-[#D9D9D9] rounded-lg focus:outline-none focus:border-[#633CFF] focus:ring-2 focus:ring-[#EFEBFF]"
            value={firstName}
            onChange={(e) => onUpdate({ firstName: e.target.value })}
            placeholder="e.g. John"
          />
        </div>

        {/* Last Name */}
        <div className="mb-6">
          <label
            htmlFor="lastName"
            className="block text-[#737373] font-medium mb-1"
          >
            Last name*
          </label>
          <input
            id="lastName"
            type="text"
            className="w-full px-4 py-3 border border-[#D9D9D9] rounded-lg focus:outline-none focus:border-[#633CFF] focus:ring-2 focus:ring-[#EFEBFF]"
            value={lastName}
            onChange={(e) => onUpdate({ lastName: e.target.value })}
            placeholder="e.g. Appleseed"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-[#737373] font-medium mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full px-4 py-3 border border-[#D9D9D9] rounded-lg focus:outline-none focus:border-[#633CFF] focus:ring-2 focus:ring-[#EFEBFF]"
            value={email}
            onChange={(e) => onUpdate({ email: e.target.value })}
            placeholder="e.g. email@example.com"
          />
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button className="bg-[#633CFF] text-white font-semibold px-7 py-3 rounded-lg hover:bg-[#7857FF] transition">
          Save
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
