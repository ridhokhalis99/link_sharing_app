import React from 'react';

interface TwitchIconProps {
  className?: string;
}

const TwitchIcon: React.FC<TwitchIconProps> = ({ className }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M9.70007 4.9415H10.8917V8.50817H9.70007M12.9751 4.9415H14.1667V8.50817H12.9751M5.8334 1.6665L2.8584 4.6415V15.3582H6.42506V18.3332L9.4084 15.3582H11.7834L17.1417 9.99984V1.6665M15.9501 9.40817L13.5751 11.7832H11.1917L9.1084 13.8665V11.7832H6.42506V2.85817H15.9501V9.40817Z"
      fill="white"
    />
  </svg>
);

export default TwitchIcon;