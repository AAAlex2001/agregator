"use client";

import { useState } from "react";
import { useNotifications } from "@/shared/ui/notifications";
import { uploadRtnAttachment } from "../api/upload-rtn-attachment";
import type { RtnAttachments, RtnFile } from "./types";

/** Загружает выбранные файлы сразу и хранит их до отправки комментария. */
export function useRtnAttachments(): RtnAttachments {
  const { showError } = useNotifications();
  const [files, setFiles] = useState<RtnFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  /** Добавляет в список файл, принятый сервером. */
  async function add(file: File) {
    setIsUploading(true);

    try {
      const uploadedFile = await uploadRtnAttachment(file);

      setFiles((current) => [...current, uploadedFile]);
    } catch (error) {
      showError(
        error instanceof Error
          ? error.message
          : "Не удалось загрузить файл",
      );
    } finally {
      setIsUploading(false);
    }
  }

  /** Исключает вложение из следующего комментария. */
  function remove(url: string) {
    setFiles((current) => current.filter((file) => file.url !== url));
  }

  /** Освобождает список после успешной отправки комментария. */
  function clear() {
    setFiles([]);
  }

  return {
    files,
    isUploading,
    add,
    remove,
    clear,
  };
}
