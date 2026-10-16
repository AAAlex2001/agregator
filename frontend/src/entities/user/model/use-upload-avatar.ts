"use client";

import { useState } from "react";
import { uploadAvatar } from "../api/upload-avatar";
import { validateAvatar } from "./avatar";
import { useUser } from "./use-user";

/** Проверяет выбранное фото, загружает его и обновляет общий профиль. */
export function useUploadAvatar() {
  const [isUploading, setIsUploading] = useState(false);
  const { updateUser } = useUser();

  /** Загружает допустимый файл и применяет его к текущему аккаунту. */
  async function upload(file: File) {
    const error = validateAvatar(file);

    if (error) {
      throw new Error(error);
    }

    setIsUploading(true);

    try {
      const user = await uploadAvatar(file);
      updateUser(user);
      return user;
    } finally {
      setIsUploading(false);
    }
  }

  return {
    isUploading,
    upload,
  };
}
