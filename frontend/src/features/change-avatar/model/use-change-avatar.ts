"use client";

import { useUploadAvatar } from "@/entities/user";
import { useNotifications } from "@/shared/ui/notifications";

/** Загружает выбранное фото и показывает результат замены. */
export function useChangeAvatar() {
  const { isUploading, upload } = useUploadAvatar();
  const { showError, showSuccess } = useNotifications();

  /** Передаёт файл операции загрузки, пока предыдущая загрузка не выполняется. */
  async function changeAvatar(file: File) {
    if (isUploading) {
      return;
    }

    try {
      await upload(file);
      showSuccess("Фото обновлено");
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Не удалось загрузить фото",
      );
    }
  }

  return {
    isUploading,
    changeAvatar,
  };
}
