import React from 'react';
import Image from 'next/image';

interface ProfileCardProps {
  name: string;
  email: string;
  imageUrl?: string;
  onUpdate: (data: { name?: string; email?: string; imageUrl?: string }) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ 
  name, 
  email, 
  imageUrl, 
  onUpdate 
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
      <h2 className="text-2xl font-bold mb-6">Profile Details</h2>
      <p className="text-gray-500 mb-6">
        Add your details to create a personal touch to your profile.
      </p>

      {/* Profile Picture */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profile Picture
        </label>
        <div className="flex items-start">
          <div className="w-24 h-24 bg-[#EFEBFF] rounded-lg flex items-center justify-center mr-4">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt="Profile"
                width={96}
                height={96}
                className="rounded-lg object-cover"
              />
            ) : (
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 16.667C22.301 16.667 24.167 14.801 24.167 12.5C24.167 10.199 22.301 8.333 20 8.333C17.699 8.333 15.833 10.199 15.833 12.5C15.833 14.801 17.699 16.667 20 16.667Z" fill="#633CFF"/>
                <path d="M10 31.667C10 26.667 14.5 22.5 20 22.5C25.5 22.5 30 26.667 30 31.667" stroke="#633CFF" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </div>
          <div>
            <label className="btn-secondary cursor-pointer inline-block">
              Upload Image
              <input 
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
            <p className="text-xs text-gray-500 mt-2">
              Image must be below 1024x1024px. Use PNG or JPG format.
            </p>
          </div>
        </div>
      </div>

      {/* Name */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-gray-700">
            First Name
          </label>
        </div>
        <div className="relative">
          <input
            type="text"
            className="input pl-10"
            value={name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="e.g. John Doe"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 8C9.933 8 11.5 6.433 11.5 4.5C11.5 2.567 9.933 1 8 1C6.067 1 4.5 2.567 4.5 4.5C4.5 6.433 6.067 8 8 8Z" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M1 15C1 12.239 4.134 10 8 10C11.866 10 15 12.239 15 15" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Email */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
        </div>
        <div className="relative">
          <input
            type="email"
            className="input pl-10"
            value={email}
            onChange={(e) => onUpdate({ email: e.target.value })}
            placeholder="e.g. email@example.com"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 3.5L8 9.5L2 3.5" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 3.5H14V12.5C14 12.6326 13.9473 12.7598 13.8536 12.8536C13.7598 12.9473 13.6326 13 13.5 13H2.5C2.36739 13 2.24021 12.9473 2.14645 12.8536C2.05268 12.7598 2 12.6326 2 12.5V3.5Z" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="btn-primary">Save</button>
      </div>
    </div>
  );
};

export default ProfileCard;