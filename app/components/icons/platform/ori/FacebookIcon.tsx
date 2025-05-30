import React from "react";

interface FacebookIconProps {
  className?: string;
}

const FacebookIcon: React.FC<FacebookIconProps> = ({ className }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g clipPath="url(#clip0_86_26460)">
      <path
        d="M19.9996 10.061C19.9996 4.50354 15.5221 -0.00146484 9.99957 -0.00146484C4.47457 -0.000214844 -0.00292969 4.50354 -0.00292969 10.0623C-0.00292969 15.0835 3.65457 19.246 8.43457 20.001V12.9698H5.89707V10.0623H8.43707V7.84354C8.43707 5.32229 9.93082 3.92979 12.2146 3.92979C13.3096 3.92979 14.4533 4.12604 14.4533 4.12604V6.60104H13.1921C11.9508 6.60104 11.5633 7.37729 11.5633 8.17354V10.061H14.3358L13.8933 12.9685H11.5621V19.9998C16.3421 19.2448 19.9996 15.0823 19.9996 10.061Z"
        fill="white"
      />
    </g>
    <defs>
      <clipPath id="clip0_86_26460">
        <rect width="20" height="20" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FacebookIcon;
