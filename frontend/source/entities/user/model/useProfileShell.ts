"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/source/shared/ui/Notifications";
import type { UserProfile } from "./types";
import { logout as logoutRequest } from "../api/profile.api";
import { useProfileForm } from "./useProfileForm";

const AVATAR_MAX_SIZE = 5 * 1024 * 1024;
const AVATAR_INVALID_TYPE = "Можно загрузить только JPG или PNG размером до 5 МБ";
const AVATAR_TOO_LARGE = "Размер фото не должен превышать 5 МБ";

interface Options {
  profile: UserProfile;
  onProfileUpdate: (profile: UserProfile | null) => void;
}

export function useProfileShell({ profile, onProfileUpdate }: Options) {
  const router = useRouter();
  const { showError, showSuccess } = useNotifications();
  const form = useProfileForm(profile);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    return () => {
      if (avatarPreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreviewUrl);
      }
    };
  }, [avatarPreviewUrl]);

  const handleAvatarSelect = (file: File | null) => {
    if (!file) return;

    const isAllowedType =
      ["image/jpeg", "image/png"].includes(file.type) || /\.(jpe?g|png)$/i.test(file.name);
    if (!isAllowedType) {
      setAvatarError(AVATAR_INVALID_TYPE);
      showError(AVATAR_INVALID_TYPE);
      return;
    }
    if (file.size > AVATAR_MAX_SIZE) {
      setAvatarError(AVATAR_TOO_LARGE);
      showError(AVATAR_TOO_LARGE);
      return;
    }

    setAvatarError(null);
    setAvatarFile(file);
    setAvatarPreviewUrl((current) => {
      if (current?.startsWith("blob:")) URL.revokeObjectURL(current);
      return URL.createObjectURL(file);
    });
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await form.handleSave(avatarFile);
    if (result.errorMessage) {
      showError(result.errorMessage);
      return;
    }
    if (result.profile) {
      onProfileUpdate(result.profile);
      setAvatarFile(null);
      setAvatarError(null);
      setAvatarPreviewUrl((current) => {
        if (current?.startsWith("blob:")) URL.revokeObjectURL(current);
        return null;
      });
    }
    if (result.successMessage) showSuccess(result.successMessage);
  };

  const logout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    await logoutRequest();
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token");
    onProfileUpdate(null);
    router.push("/");
  };

  return {
    form,
    avatarPreviewUrl,
    avatarError,
    isLoggingOut,
    isSaving: form.isSaving,
    handleAvatarSelect,
    submit,
    logout,
  };
}
