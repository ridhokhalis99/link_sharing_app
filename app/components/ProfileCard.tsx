import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { saveUserProfile, uploadProfileImage } from "../lib/profiles";
import { useAuth } from "../context/AuthContext";
import TextInput from "./TextInput";

interface ProfileCardProps {
  firstName: string;
  lastName: string;
  email: string;
  imageUrl?: string;
  onUpdate: (data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    imageUrl?: string;
  }) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  firstName,
  lastName,
  email,
  imageUrl,
  onUpdate,
}) => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Local form state to ensure controlled inputs
  const [formState, setFormState] = useState({
    firstName: firstName || "",
    lastName: lastName || "",
    email: email || "",
    imageUrl: imageUrl || "",
  });

  // Update local state when props change
  useEffect(() => {
    setFormState({
      firstName: firstName || "",
      lastName: lastName || "",
      email: email || "",
      imageUrl: imageUrl || "",
    });
  }, [firstName, lastName, email, imageUrl]);

  // Track if we have a local image that needs to be uploaded
  const [hasNewLocalImage, setHasNewLocalImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Store a stable reference to the current onUpdate function
  const onUpdateRef = useRef(onUpdate);

  // Update the ref when onUpdate changes
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  // Safe update function that uses the ref
  const safeUpdate = useCallback(
    (data: {
      firstName?: string;
      lastName?: string;
      email?: string;
      imageUrl?: string;
    }) => {
      onUpdateRef.current(data);
      // Also update local form state
      setFormState((prev) => ({
        ...prev,
        ...data,
      }));
    },
    []
  );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError("Image must be less than 2MB");
        return;
      }

      // Clear any previous errors
      setError(null);

      // Flag that we have a new image that needs to be uploaded
      setHasNewLocalImage(true);

      // Temporarily show the image from local
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newImageUrl = event.target.result as string;
          safeUpdate({ imageUrl: newImageUrl });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // First handle image upload if there's a new image
      let finalImageUrl = formState.imageUrl;

      if (hasNewLocalImage && fileInputRef.current?.files?.length) {
        const uploadedUrl = await uploadProfileImage(
          fileInputRef.current.files[0]
        );
        if (uploadedUrl) {
          // Add a cache-busting parameter to ensure the browser loads the new image
          finalImageUrl = `${uploadedUrl}?t=${Date.now()}`;
        } else {
          throw new Error("Failed to upload profile image");
        }
      }

      // Save profile data
      const profileData = {
        first_name: formState.firstName,
        last_name: formState.lastName,
        email: formState.email,
        image_url: finalImageUrl,
      };

      const result = await saveUserProfile(profileData);

      if (result) {
        // Update the parent component's state with the saved data
        safeUpdate({
          firstName: result.first_name || formState.firstName,
          lastName: result.last_name || formState.lastName,
          email: result.email || formState.email,
          imageUrl: finalImageUrl,
        });

        if (hasNewLocalImage) {
          setHasNewLocalImage(false);
        }

        setSuccessMessage("Profile saved successfully!");
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        throw new Error("Failed to save profile data");
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      setError(
        typeof err === "object" && err !== null && "message" in err
          ? (err as Error).message
          : "Failed to save profile data"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof typeof formState, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-md flex flex-col h-full">
      <div className="p-6 pb-0 sticky top-0 bg-white z-10">
        <h2 className="text-[32px] font-bold mb-2 text-[#333333]">
          Profile Details
        </h2>
        <p className="text-[#737373] mb-6">
          Add your details to create a personal touch to your profile.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            <p>{successMessage}</p>
          </div>
        )}
      </div>

      {/* Profile Picture and Form Fields */}
      <div className="p-6 flex-1 overflow-y-auto">
        {/* Profile Picture */}
        <div className="bg-[#FAFAFA] p-5 rounded-xl mb-6">
          <div className="flex flex-col md:flex-row md:items-center">
            <label className="text-[#737373] font-medium mb-4 md:mb-0 md:w-1/3">
              Profile picture
            </label>

            <div className="md:flex md:items-center gap-6 md:w-2/3">
              <div className="w-[193px] h-[193px] bg-[#EFEBFF] rounded-xl flex flex-col items-center justify-center relative overflow-hidden mb-6 md:mb-0">
                {formState.imageUrl ? (
                  <div className="w-full h-full">
                    <Image
                      src={formState.imageUrl}
                      alt="Profile"
                      width={193}
                      height={193}
                      className="object-cover w-full h-full"
                      unoptimized={formState.imageUrl.startsWith("data:")} // Skip optimization for data URLs
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M26.6667 20H13.3333"
                        stroke="#633CFF"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M20 13.3333L20 26.6666"
                        stroke="#633CFF"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="text-[#633CFF] font-semibold mt-2 text-sm">
                      + Upload Image
                    </span>
                  </div>
                )}
                <input
                  id="profile-image"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleImageUpload}
                />
              </div>

              <div className="text-[#737373] text-xs">
                Image must be below 2MB.
                <br />
                Use PNG or JPG format.
              </div>
            </div>
          </div>
        </div>

        {/* Form Fields - All in one container */}
        <div className="bg-[#FAFAFA] p-5 rounded-xl flex-1 flex flex-col">
          {/* First Name */}
          <div className="mb-6">
            <TextInput
              id="firstName"
              label="First name"
              type="text"
              value={formState.firstName}
              onChange={(e) => {
                handleInputChange("firstName", e.target.value);
                safeUpdate({ firstName: e.target.value });
              }}
              placeholder="e.g. John"
              required={true}
            />
          </div>

          {/* Last Name */}
          <div className="mb-6">
            <TextInput
              id="lastName"
              label="Last name"
              type="text"
              value={formState.lastName}
              onChange={(e) => {
                handleInputChange("lastName", e.target.value);
                safeUpdate({ lastName: e.target.value });
              }}
              placeholder="e.g. Appleseed"
              required={true}
            />
          </div>

          {/* Email */}
          <div className="flex-1">
            <TextInput
              id="email"
              label="Email"
              type="email"
              value={formState.email}
              onChange={(e) => {
                handleInputChange("email", e.target.value);
                safeUpdate({ email: e.target.value });
              }}
              placeholder="e.g. email@example.com"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-[#D9D9D9] sticky bottom-0 bg-white z-10">
        <div className="flex justify-end p-6">
          <button
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="bg-[#633CFF] text-white font-semibold px-7 py-3 rounded-lg hover:bg-[#7857FF] transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <span className="animate-spin inline-block h-4 w-4 border-t-2 border-white rounded-full mr-2"></span>
                Saving...
              </>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
