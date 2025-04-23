import React from 'react';
import Image from 'next/image';

interface LinkItem {
  platform: string;
  url: string;
}

interface PhonePreviewProps {
  name: string;
  email: string;
  imageUrl?: string;
  links: LinkItem[];
}

const platformStyles: Record<string, { bgColor: string, textColor: string, icon?: string }> = {
  GitHub: { bgColor: '#333333', textColor: '#FFFFFF', icon: '/github.svg' },
  Twitter: { bgColor: '#1DA1F2', textColor: '#FFFFFF', icon: '/twitter.svg' },
  LinkedIn: { bgColor: '#0077B5', textColor: '#FFFFFF', icon: '/linkedin.svg' },
  Facebook: { bgColor: '#1877F2', textColor: '#FFFFFF', icon: '/facebook.svg' },
  Instagram: { bgColor: '#E4405F', textColor: '#FFFFFF', icon: '/instagram.svg' },
  YouTube: { bgColor: '#FF0000', textColor: '#FFFFFF', icon: '/youtube.svg' },
  Default: { bgColor: '#633CFF', textColor: '#FFFFFF', icon: '/globe.svg' }
};

const PhonePreview: React.FC<PhonePreviewProps> = ({ 
  name, 
  email, 
  imageUrl, 
  links 
}) => {
  return (
    <div className="border border-gray-200 rounded-3xl w-[308px] h-[632px] p-4 flex flex-col items-center bg-white shadow-md mx-auto">
      {/* Header Area with Mockup Phone Details */}
      <div className="w-full flex justify-center relative mb-6">
        <div className="w-32 h-6 bg-black rounded-b-xl"></div>
      </div>

      {/* User Profile */}
      <div className="mt-8 flex flex-col items-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full mb-6 overflow-hidden">
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
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 16.667C22.301 16.667 24.167 14.801 24.167 12.5C24.167 10.199 22.301 8.333 20 8.333C17.699 8.333 15.833 10.199 15.833 12.5C15.833 14.801 17.699 16.667 20 16.667Z" fill="#633CFF"/>
                <path d="M10 31.667C10 26.667 14.5 22.5 20 22.5C25.5 22.5 30 26.667 30 31.667" stroke="#633CFF" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{name || 'Your Name'}</h2>
        <p className="text-gray-500 mb-8">{email || 'email@example.com'}</p>
      </div>

      {/* Links */}
      <div className="w-full space-y-4 px-4 overflow-y-auto flex-grow">
        {links && links.length > 0 ? (
          links.map((link, index) => {
            const style = platformStyles[link.platform] || platformStyles.Default;
            return (
              <a 
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center py-3 px-4 rounded-lg flex items-center justify-center gap-2"
                style={{ backgroundColor: style.bgColor, color: style.textColor }}
              >
                {style.icon && (
                  <div className="w-5 h-5">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 0C4.5 0 0 4.5 0 10s4.5 10 10 10 10-4.5 10-10S15.5 0 10 0z" />
                    </svg>
                  </div>
                )}
                <span>{link.platform}</span>
              </a>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No links added yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhonePreview;