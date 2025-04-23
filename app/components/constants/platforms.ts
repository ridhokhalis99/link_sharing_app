export interface PlatformStyle {
  bgColor: string;
  textColor: string;
  icon: string;
}

export const PLATFORM_STYLES: Record<string, PlatformStyle> = {
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
  Codepen: { bgColor: "#000000", textColor: "#FFFFFF", icon: "/globe.svg" },
  Codewars: { bgColor: "#B1361E", textColor: "#FFFFFF", icon: "/globe.svg" },
  DevTo: { bgColor: "#0A0A0A", textColor: "#FFFFFF", icon: "/globe.svg" },
  FreeCodeCamp: {
    bgColor: "#0A0A23",
    textColor: "#FFFFFF",
    icon: "/globe.svg",
  },
  FrontendMentor: {
    bgColor: "#3E54A3",
    textColor: "#FFFFFF",
    icon: "/globe.svg",
  },
  Gitlab: { bgColor: "#FC6D26", textColor: "#FFFFFF", icon: "/globe.svg" },
  HashNode: { bgColor: "#2962FF", textColor: "#FFFFFF", icon: "/globe.svg" },
  StackOverflow: {
    bgColor: "#F48024",
    textColor: "#FFFFFF",
    icon: "/globe.svg",
  },
  Twitch: { bgColor: "#9146FF", textColor: "#FFFFFF", icon: "/globe.svg" },
  Default: { bgColor: "#633CFF", textColor: "#FFFFFF", icon: "/globe.svg" },
};

export const getPlatformStyle = (platform: string): PlatformStyle => {
  return PLATFORM_STYLES[platform] || PLATFORM_STYLES.Default;
};
