import React from "react";

interface PasswordIconProps {
  className?: string;
  width?: number;
  height?: number;
}

const PasswordIcon: React.FC<PasswordIconProps> = ({
  className = "",
  width = 16,
  height = 16,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M13 5h-2V3.5C11 1.5 9.5 0 7.5 0S4 1.5 4 3.5V5H2C1.4 5 1 5.4 1 6v9c0 0.6 0.4 1 1 1h11c0.6 0 1-0.4 1-1V6C14 5.4 13.6 5 13 5zM5 3.5c0-1.4 1.1-2.5 2.5-2.5S10 2.1 10 3.5V5H5V3.5z"
        fill="#737373"
      />
    </svg>
  );
};

export default PasswordIcon;
