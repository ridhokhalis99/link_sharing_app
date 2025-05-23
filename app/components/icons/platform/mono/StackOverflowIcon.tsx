interface StackOverflowIconProps {
  className?: string;
  color?: string;
}

const StackOverflowIcon: React.FC<StackOverflowIconProps> = ({
  color = "#737373",
  className = "",
}) => (
  <svg
    width="16"
    height="17"
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g clipPath="url(#clip0_86_26158)">
      <path
        d="M12.6555 15.0755V10.8075H14.08V16.5H1.22852V10.8075H2.64802V15.0755H12.6555ZM4.07202 13.6535H11.234V12.2295H4.07202V13.6535ZM4.24702 10.4195L11.2345 11.8775L11.534 10.4975L4.54952 9.0415L4.24702 10.4195ZM5.15302 7.0495L11.6225 10.068L12.224 8.768L5.75552 5.7475L5.15352 7.0395L5.15302 7.0495ZM6.96302 3.8595L12.4395 8.43L13.346 7.3485L7.86952 2.781L6.96802 3.8565L6.96302 3.8595ZM10.4995 0.5L9.33552 1.362L13.606 7.0985L14.77 6.2365L10.4995 0.5Z"
        fill={color}
      />
    </g>
    <defs>
      <clipPath id="clip0_86_26158">
        <rect
          width="16"
          height="16"
          fill="white"
          transform="translate(0 0.5)"
        />
      </clipPath>
    </defs>
  </svg>
);

export default StackOverflowIcon;
