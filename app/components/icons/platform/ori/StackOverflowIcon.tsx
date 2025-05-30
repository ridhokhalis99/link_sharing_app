import React from 'react';

interface StackOverflowIconProps {
  className?: string;
}

const StackOverflowIcon: React.FC<StackOverflowIconProps> = ({ className }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M15.8199 18.2194V12.8844H17.6005V20H1.53613V12.8844H3.31051V18.2194H15.8199ZM5.09051 16.4419H14.043V14.6619H5.09051V16.4419ZM5.30926 12.3994L14.0436 14.2219L14.418 12.4969L5.68738 10.6769L5.30926 12.3994ZM6.44176 8.18688L14.5286 11.96L15.2805 10.335L7.19488 6.55937L6.44238 8.17438L6.44176 8.18688ZM8.70426 4.19938L15.5499 9.9125L16.683 8.56063L9.83738 2.85125L8.71051 4.19562L8.70426 4.19938ZM13.1249 0L11.6699 1.0775L17.008 8.24813L18.463 7.17062L13.1249 0Z"
      fill="white"
    />
  </svg>
);

export default StackOverflowIcon;