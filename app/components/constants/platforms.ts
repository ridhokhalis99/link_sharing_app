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
  Default: { bgColor: "#633CFF", textColor: "#FFFFFF", icon: "/globe.svg" },
};

export const getPlatformStyle = (platform: string): PlatformStyle => {
  return PLATFORM_STYLES[platform] || PLATFORM_STYLES.Default;
};
