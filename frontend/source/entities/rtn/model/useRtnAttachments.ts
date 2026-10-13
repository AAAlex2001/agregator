"use client";

import { useState } from "react";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { uploadRtnAttachment } from "../api/comment.api";
import type { RtnFile } from "./clarification";

export interface RtnAttachments {
  files: RtnFile[];
  isUploading: boolean;
  add: (file: File) => Promise<void>;
  remove: (url: string) => void;
  clear: () => void;
}

/** Файлы к комментарию или ответу: загружаются на сервер сразу при выборе. */
export function useRtnAttachments(): RtnAttachments {
  const { showError } = useNotifications();
  const [files, setFiles] = useState<RtnFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const add = async (file: File) => {
    setIsUploading(true);
    try {
      const uploaded = await uploadRtnAttachment(file);
      setFiles((current) => [...current, uploaded]);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось загрузить файл");
    } finally {
      setIsUploading(false);
    }
  };

  const remove = (url: string) => setFiles((current) => current.filter((file) => file.url !== url));

  return { files, isUploading, add, remove, clear: () => setFiles([]) };
}
