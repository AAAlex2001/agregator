"use client";

import { useState } from "react";
import { uploadAvatar } from "@/source/entities/user";
import { useSession } from "@/source/entities/session";
import { useNotifications } from "@/source/shared/ui/Notifications";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png"];

/** Загружает новое фото профиля сразу после выбора файла. */
export function useUpdatePhoto() {
  const { setUser } = useSession();
  const { showError, showSuccess } = useNotifications();
  const [isUploading, setIsUploading] = useState(false);

  const upload = async (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      showError("Можно загрузить только JPG или PNG");
      return;
    }
    if (file.size > MAX_SIZE) {
      showError("Размер фото не должен превышать 5 МБ");
      return;
    }

    setIsUploading(true);
    try {
      setUser(await uploadAvatar(file));
      showSuccess("Фото обновлено");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось загрузить фото");
    } finally {
      setIsUploading(false);
    }
  };

  return { isUploading, upload };
}
