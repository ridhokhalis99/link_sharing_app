import { useState, useEffect } from "react";
import { getUserLinks } from "../lib/links";
import { getUserProfile } from "../lib/profiles";

export interface LinkItem {
  id?: string;
  platform: string;
  url: string;
  order?: number;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string;
}

export function useUserData() {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    email: "",
    imageUrl: "",
  });
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch user profile
        const profileData = await getUserProfile();
        if (profileData) {
          setUserProfile({
            firstName: profileData.first_name || "",
            lastName: profileData.last_name || "",
            email: profileData.email || "",
            imageUrl: profileData.image_url || "",
          });
        }

        // Fetch user links
        const linksData = await getUserLinks();
        if (linksData) {
          setLinks(linksData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleProfileUpdate = (data: Partial<UserProfile>) => {
    setUserProfile({
      ...userProfile,
      ...data,
    });
  };

  const handleLinksChange = (newLinks: LinkItem[]) => {
    setLinks(newLinks);
  };

  return {
    userProfile,
    links,
    isLoading,
    handleProfileUpdate,
    handleLinksChange,
  };
}
