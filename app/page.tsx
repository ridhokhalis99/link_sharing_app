"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PhonePreview from "./components/PhonePreview";
import LinksManager from "./components/LinksManager";
import ProfileCard from "./components/ProfileCard";
import LinkIcon from "./components/icons/LinkIcon";
import ProfileIcon from "./components/icons/ProfileIcon";

interface LinkItem {
  platform: string;
  url: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<"links" | "profile">("links");
  const [userProfile, setUserProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    imageUrl: "",
  });
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isPreview, setIsPreview] = useState(false);

  const handleProfileUpdate = (data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    imageUrl?: string;
  }) => {
    setUserProfile({
      ...userProfile,
      ...data,
    });
  };

  const handleLinksChange = (newLinks: LinkItem[]) => {
    setLinks(newLinks);
  };

  if (isPreview) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] p-4 flex flex-col">
        <header className="bg-white rounded-xl shadow-sm p-4 mb-6 flex justify-between items-center">
          <button
            onClick={() => setIsPreview(false)}
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
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-4 md:p-6">
      {/* Header/Navigation */}
      <nav className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap justify-between items-center">
        <div className="flex items-center">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2"
          >
            <rect width="40" height="40" rx="8" fill="#633CFF" />
            <path d="M22.5 15L17.5 20L22.5 25" stroke="white" strokeWidth="2" />
            <path d="M17.5 25L22.5 30" stroke="white" strokeWidth="2" />
            <path d="M22.5 10L17.5 15" stroke="white" strokeWidth="2" />
          </svg>
          <h1 className="font-bold text-xl">devlinks</h1>
        </div>
        <div className="flex gap-2 md:gap-4">
          <button
            onClick={() => setActiveTab("links")}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer ${
              activeTab === "links"
                ? "bg-[#EFEBFF] text-[#633CFF] font-medium"
                : "text-[#737373] font-normal"
            }`}
          >
            <LinkIcon
              className="w-5 h-5"
              color={activeTab === "links" ? "#633CFF" : "#737373"}
            />
            Links
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer ${
              activeTab === "profile"
                ? "bg-[#EFEBFF] text-[#633CFF] font-medium"
                : "text-[#737373] font-normal"
            }`}
          >
            <ProfileIcon
              className="w-5 h-5"
              color={activeTab === "profile" ? "#633CFF" : "#737373"}
            />
            Profile Details
          </button>
        </div>
        <button
          onClick={() => setIsPreview(true)}
          className="btn-secondary border border-[#633CFF] bg-white"
        >
          Preview
        </button>
      </nav>

      {/* Main Content Area */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Phone Preview */}
        <div className="hidden md:block md:w-1/3">
          <PhonePreview
            firstName={userProfile.firstName}
            lastName={userProfile.lastName}
            email={userProfile.email}
            imageUrl={userProfile.imageUrl}
            links={links}
          />
        </div>

        {/* Content Management */}
        <div className="w-full md:w-2/3">
          {activeTab === "links" ? (
            <LinksManager
              onLinksChange={handleLinksChange}
              initialLinks={links}
            />
          ) : (
            <ProfileCard
              firstName={userProfile.firstName}
              lastName={userProfile.lastName}
              email={userProfile.email}
              imageUrl={userProfile.imageUrl}
              onUpdate={handleProfileUpdate}
            />
          )}
        </div>
      </div>
    </div>
  );
}
