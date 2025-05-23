import React from "react";

interface HashNodeIconProps {
  className?: string;
}

const HashNodeIcon: React.FC<HashNodeIconProps> = ({ className }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g clipPath="url(#clip0_86_26597)">
      <path
        d="M1.37432 6.68379C-0.458106 8.48066 -0.458106 11.4846 1.37432 13.3166L6.6833 18.6252C8.48018 20.4572 11.4841 20.4572 13.3161 18.6252L18.6247 13.3166C20.4567 11.4846 20.4567 8.48066 18.6247 6.68379L13.3161 1.3748C11.4841 -0.457617 8.48018 -0.457617 6.6833 1.3748L1.37432 6.68379ZM12.3239 12.3244C11.0388 13.6057 8.96064 13.6057 7.6794 12.3244C6.39424 11.0393 6.39424 8.96113 7.6794 7.67988C8.96064 6.39473 11.0388 6.39473 12.3239 7.67988C13.6052 8.96113 13.6052 11.0393 12.3239 12.3244Z"
        fill="white"
      />
    </g>
    <defs>
      <clipPath id="clip0_86_26597">
        <rect width="20" height="20" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default HashNodeIcon;
