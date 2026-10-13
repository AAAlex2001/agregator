"use client";

import { useState } from "react";
import { localFileItem } from "@/source/shared/lib/localFile";
import { useNotifications } from "@/source/shared/ui/Notifications";
import type { FileGalleryItem } from "@/source/shared/ui/FileGallery";

const ACCEPT_EXTENSIONS = [".pdf", ".jpeg", ".jpg", ".png", ".doc", ".docx", ".xls", ".xlsx"];
const MAX_FILE_SIZE = 100 * 1024 * 1024;

export const TICKET_FILE_ACCEPT = ACCEPT_EXTENSIONS.join(",");
export const MAX_TICKET_FILES = 6;
export const TICKET_FILES_HINT = `До ${MAX_TICKET_FILES} файлов: PDF, JPEG, PNG, DOC, DOCX, XLS, XLSX`;

/** Причина, по которой файлы нельзя приложить, или null. */
function filesProblem(current: File[], next: File[]): string | null {
  if (current.length + next.length > MAX_TICKET_FILES) return `Можно прикрепить не больше ${MAX_TICKET_FILES} файлов`;
  if (next.some((file) => file.size > MAX_FILE_SIZE)) return `Файл больше ${MAX_FILE_SIZE / 1024 / 1024} МБ не поддерживается`;
  const isAccepted = (file: File) => ACCEPT_EXTENSIONS.some((extension) => file.name.toLowerCase().endsWith(extension));
  if (!next.every(isAccepted)) return "Поддерживаются: PDF, JPEG, PNG, DOC, DOCX, XLS, XLSX";
  return null;
}

/** Файлы к сообщению до отправки: проверка лимитов, превью и удаление. */
export function useTicketFiles() {
  const { showError } = useNotifications();
  const [files, setFiles] = useState<File[]>([]);
  const add = (picked: FileList | null) => {
    const next = Array.from(picked ?? []);
    if (next.length === 0) return;
    const problem = filesProblem(files, next);
    if (problem) {
      showError(problem);
      return;
    }
    setFiles([...files, ...next]);
  };

  const items: FileGalleryItem[] = files.map((file) => localFileItem(file, () => setFiles(files.filter((item) => item !== file))));

  return { files, items, isFull: files.length >= MAX_TICKET_FILES, add, clear: () => setFiles([]) };
}
