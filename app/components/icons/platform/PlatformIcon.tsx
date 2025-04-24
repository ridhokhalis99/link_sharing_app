import React, { lazy, Suspense } from "react";

export type PlatformType =
  | "Codepen"
  | "Codewars"
  | "DevTo"
  | "Facebook"
  | "FreeCodeCamp"
  | "FrontendMentor"
  | "GitHub"
  | "Gitlab"
  | "HashNode"
  | "LinkedIn"
  | "StackOverflow"
  | "Twitch"
  | "Twitter"
  | "YouTube";

type VersionType = "mono" | "ori";

interface PlatformIconProps {
  name: PlatformType;
  version?: VersionType;
  color?: string;
  className?: string;
}

const PlatformIcon: React.FC<PlatformIconProps> = ({
  name,
  version = "mono",
  color,
  className,
}) => {
  const IconComponent = React.useMemo(() => {
    return lazy(() => {
      if (version === "mono") {
        return import(`./${version}/${name}Icon`).catch(() => {
          console.error(`Failed to load ${version}/${name}Icon`);
          return Promise.reject(
            new Error(`Icon not found: ${version}/${name}Icon`)
          );
        });
      }

      return import(`./${version}/${name}Icon`).catch(() => {
        console.error(`Failed to load ${version}/${name}Icon`);
        return import(`./mono/${name}Icon`).catch(() => {
          return Promise.reject(new Error(`Icon not found: ${name}Icon`));
        });
      });
    });
  }, [name, version]);

  return (
    <Suspense fallback={<div style={{ width: 16, height: 16 }} />}>
      {version === "mono" ? (
        <IconComponent color={color} className={className} />
      ) : (
        <IconComponent className={className} />
      )}
    </Suspense>
  );
};

export default PlatformIcon;
