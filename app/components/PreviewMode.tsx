import React from "react";
import SimplePreview from "./SimplePreview";
import LogoIcon from "./icons/LogoIcon";

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
      <nav className="bg-white rounded-xl shadow-sm p-4 mb-4 flex justify-between items-center">
        <div className="flex items-center gap-2 w-1/3">
          <LogoIcon />
          <h1 className="text-2xl font-bold text-[#333333]">devlinks</h1>
        </div>

        <div className="flex justify-center w-1/3">
          <span className="text-[#737373] font-medium">Preview</span>
        </div>

        <div className="flex justify-end w-1/3 gap-4">
          <button
            onClick={onBackClick}
            className="px-4 py-2 border border-[#633CFF] text-[#633CFF] font-medium rounded-lg hover:bg-[#EFEBFF] transition-colors"
          >
            Back to Editor
          </button>
          <button className="px-4 py-2 bg-[#633CFF] text-white font-medium rounded-lg hover:bg-[#BEADFF] transition-colors">
            Share Link
          </button>
        </div>
      </nav>

      <div className="flex-grow flex items-center justify-center">
        <SimplePreview
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
