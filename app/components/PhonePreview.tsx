import React from "react";
import Image from "next/image";

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

const platformStyles: Record<
  string,
  { bgColor: string; textColor: string; icon: string }
> = {
  GitHub: { bgColor: "#1A1A1A", textColor: "#FFFFFF", icon: "/github.svg" },
  YouTube: { bgColor: "#EE3939", textColor: "#FFFFFF", icon: "/youtube.svg" },
  LinkedIn: { bgColor: "#2D68FF", textColor: "#FFFFFF", icon: "/linkedin.svg" },
  Facebook: { bgColor: "#4267B2", textColor: "#FFFFFF", icon: "/facebook.svg" },
  Twitter: { bgColor: "#1DA1F2", textColor: "#FFFFFF", icon: "/twitter.svg" },
  Instagram: {
    bgColor: "#E4405F",
    textColor: "#FFFFFF",
    icon: "/instagram.svg",
  },
  Default: { bgColor: "#633CFF", textColor: "#FFFFFF", icon: "/globe.svg" },
};

// SVG Icons as components to allow setting color to white
const GitHubIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.98188 2.28814C8.67799 1.98515 7.32201 1.98515 6.01812 2.28814C5.26514 1.82621 4.69013 1.61394 4.27199 1.52432C4.09352 1.48399 3.91094 1.46507 3.72801 1.46776C3.64481 1.47001 3.56188 1.48001 3.48046 1.49776L3.46986 1.49983L3.46562 1.50193H3.46237L3.60852 2.01499L3.46237 1.50296C3.38751 1.52417 3.31812 1.56154 3.25912 1.61243C3.20013 1.66332 3.15299 1.72643 3.12115 1.7974C2.80643 2.50206 2.74643 3.2944 2.95151 4.03846C2.42045 4.68202 2.13103 5.49098 2.13332 6.32536C2.13332 7.98191 2.62186 9.09553 3.45487 9.81132C4.03835 10.3126 4.74667 10.5793 5.45709 10.7318C5.3453 11.0601 5.30308 11.4081 5.33332 11.7537V12.3915C4.8992 12.4822 4.59844 12.4534 4.38406 12.3829C4.11631 12.2945 3.91045 12.1163 3.71314 11.8603C3.60988 11.7223 3.51381 11.5792 3.42511 11.4315L3.36428 11.3323C3.28749 11.2047 3.20782 11.0788 3.12537 10.9547C2.9227 10.655 2.62193 10.2795 2.13551 10.1515L1.61924 10.0161L1.34828 11.0486L1.86456 11.1841C1.94994 11.2054 2.06078 11.2854 2.24323 11.5532C2.31337 11.6588 2.38103 11.7662 2.44594 11.8753L2.51842 11.9926C2.61873 12.1547 2.73394 12.3339 2.86716 12.5089C3.13715 12.8609 3.50509 13.2161 4.05115 13.3963C4.42448 13.5201 4.84909 13.5499 5.33332 13.4753V15.4667C5.33332 15.6082 5.38951 15.7438 5.48953 15.8438C5.58955 15.9439 5.72516 16.0001 5.86666 16.0001H10.1333C10.2748 16.0001 10.4104 15.9439 10.5105 15.8438C10.6105 15.7438 10.6667 15.6082 10.6667 15.4667V11.6662C10.6667 11.3302 10.6517 11.0219 10.5568 10.735C11.2639 10.5857 11.9669 10.319 12.5473 9.81773C13.3792 9.09657 13.8667 7.97229 13.8667 6.30619V6.30515C13.8639 5.47764 13.5745 4.67646 13.0476 4.03846C13.2523 3.29471 13.1923 2.50292 12.8779 1.79847C12.8462 1.72739 12.7993 1.66406 12.7405 1.61299C12.6817 1.56193 12.6124 1.52435 12.5376 1.50296L12.3915 2.01499C12.5376 1.50296 12.5365 1.50296 12.5355 1.50296L12.5333 1.50193L12.5291 1.49983L12.5195 1.49776C12.4931 1.49085 12.4664 1.48548 12.4395 1.48169C12.3836 1.47354 12.3273 1.46892 12.2709 1.46776C12.088 1.46507 11.9054 1.48399 11.7269 1.52432C11.3099 1.61394 10.7349 1.82621 9.98188 2.28814Z"
      fill="white"
    />
  </svg>
);

const YouTubeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.16273 6.66665C8.51871 6.6686 9.40936 6.67725 10.356 6.71527L10.692 6.73005C11.6447 6.77463 12.5967 6.85201 13.0694 6.98327C13.6994 7.16056 14.194 7.67659 14.3614 8.33129C14.628 9.37126 14.6614 11.3993 14.6654 11.8906L14.666 11.992V12.108C14.6614 12.5993 14.628 14.628 14.3614 15.6673C14.192 16.324 13.6967 16.8406 13.0694 17.0153C12.5967 17.1466 11.6447 17.224 10.692 17.2686L10.356 17.284C9.40936 17.3213 8.51871 17.3306 8.16273 17.332L8.00603 17.3326H7.836C7.08267 17.328 3.93203 17.294 2.92936 17.0153C2.30003 16.838 1.80469 16.322 1.63736 15.6673C1.3707 14.6273 1.33736 12.5993 1.33336 12.108V11.8906C1.33736 11.3993 1.3707 9.37059 1.63736 8.33129C1.80669 7.67463 2.30203 7.15797 2.93003 6.98399C3.93203 6.7046 7.08336 6.67059 7.8367 6.66665H8.16273ZM6.66603 9.66665V14.3333L10.666 12L6.66603 9.66665Z"
      fill="white"
    />
  </svg>
);

const LinkedInIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.6667 2C13.0203 2 13.3594 2.14048 13.6095 2.39052C13.8595 2.64057 14 2.97971 14 3.33333V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H12.6667ZM12.3333 12.3333V8.8C12.3333 8.2236 12.1044 7.67089 11.6968 7.26339C11.2892 6.85589 10.7364 6.62666 10.16 6.62666C9.59333 6.62666 8.93333 6.97333 8.61333 7.49333V6.75333H6.75333V12.3333H8.61333V9.04666C8.61333 8.53333 9.02667 8.11333 9.54 8.11333C9.7875 8.11333 10.0249 8.21238 10.2 8.38741C10.375 8.56243 10.4733 8.79957 10.4733 9.04666V12.3333H12.3333ZM4.58667 5.70666C4.88371 5.70666 5.16859 5.58917 5.37863 5.37913C5.58867 5.16909 5.70667 4.88421 5.70667 4.58666C5.70667 3.96666 5.20667 3.46 4.58667 3.46C4.28788 3.46 4.00128 3.57833 3.78999 3.78962C3.5787 4.00091 3.46 4.28755 3.46 4.58666C3.46 5.20666 3.96667 5.70666 4.58667 5.70666ZM5.51333 12.3333V6.75333H3.66667V12.3333H5.51333Z"
      fill="white"
    />
  </svg>
);

const getIconComponent = (platform: string) => {
  switch (platform) {
    case "GitHub":
      return <GitHubIcon />;
    case "YouTube":
      return <YouTubeIcon />;
    case "LinkedIn":
      return <LinkedInIcon />;
    default:
      return null;
  }
};

const PhonePreview: React.FC<PhonePreviewProps> = ({
  name,
  email,
  imageUrl,
  links,
}) => {
  return (
    <div className="relative w-[308px] h-[632px] mx-auto">
      {/* Phone Frame SVG */}
      <svg
        width="308"
        height="632"
        viewBox="0 0 308 632"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-0 left-0"
      >
        <path
          d="M1 54.5C1 24.9528 24.9528 1 54.5 1H253.5C283.047 1 307 24.9528 307 54.5V577.5C307 607.047 283.047 631 253.5 631H54.5C24.9528 631 1 607.047 1 577.5V54.5Z"
          stroke="#737373"
        />
        <path
          d="M12 55.5C12 30.9233 31.9233 11 56.5 11H80.5C86.8513 11 92 16.1487 92 22.5C92 30.5081 98.4919 37 106.5 37H201.5C209.508 37 216 30.5081 216 22.5C216 16.1487 221.149 11 227.5 11H251.5C276.077 11 296 30.9233 296 55.5V576.5C296 601.077 276.077 621 251.5 621H56.5C31.9233 621 12 601.077 12 576.5V55.5Z"
          fill="white"
          stroke="#737373"
        />
      </svg>

      {/* Phone Content - Scrollable Area */}
      <div className="absolute top-[48px] bottom-[16px] left-[16px] right-[16px] overflow-y-auto flex flex-col items-center">
        {/* User Profile */}
        <div className="mt-12 mb-14 flex flex-col items-center">
          <div className="w-[96px] h-[96px] rounded-full mb-6 overflow-hidden border-[3px] border-[#633CFF]">
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
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 16.667C22.301 16.667 24.167 14.801 24.167 12.5C24.167 10.199 22.301 8.333 20 8.333C17.699 8.333 15.833 10.199 15.833 12.5C15.833 14.801 17.699 16.667 20 16.667Z"
                    fill="#633CFF"
                  />
                  <path
                    d="M10 31.667C10 26.667 14.5 22.5 20 22.5C25.5 22.5 30 26.667 30 31.667"
                    stroke="#633CFF"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            )}
          </div>
          <h2 className="text-[18px] font-semibold text-[#333333] mb-1">
            {name || "Your Name"}
          </h2>
          <p className="text-[14px] text-[#737373]">
            {email || "email@example.com"}
          </p>
        </div>

        {/* Links */}
        <div className="w-full space-y-5">
          {links && links.length > 0 ? (
            links.map((link, index) => {
              const style =
                platformStyles[link.platform] || platformStyles.Default;
              return (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block h-[44px] rounded-[8px] flex items-center w-[237px] mx-auto transition-transform hover:translate-y-[-2px]"
                  style={{
                    backgroundColor: style.bgColor,
                  }}
                >
                  {/* Platform Icon */}
                  <div className="absolute left-4 flex items-center justify-center">
                    {getIconComponent(link.platform) || (
                      <img
                        src={style.icon}
                        alt={link.platform}
                        className="w-5 h-5 filter brightness-0 invert"
                      />
                    )}
                  </div>

                  {/* Platform Name */}
                  <span className="text-[16px] font-medium text-white absolute left-[44px]">
                    {link.platform}
                  </span>

                  {/* Arrow Icon */}
                  <div className="absolute right-4">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.66699 8.00004V9.33337H10.667L7.00033 13L7.94699 13.9467L13.227 8.66671L7.94699 3.38671L7.00033 4.33337L10.667 8.00004H2.66699Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                </a>
              );
            })
          ) : (
            <div className="text-center p-8 rounded-lg border-2 border-dashed border-[#DFDFDF]">
              <p className="text-[16px] font-medium text-[#737373]">
                No links added yet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhonePreview;
