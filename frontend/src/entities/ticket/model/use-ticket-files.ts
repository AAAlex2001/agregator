"use client";

import { useState } from "react";
import type { LocalFile } from "@/shared/lib/local-file";
import { useLocalFiles } from "@/shared/lib/use-local-files";
import type { FileGalleryItem } from "@/shared/ui/file-gallery";
import { useNotifications } from "@/shared/ui/notifications";
import { TICKET_FILE_LIMIT } from "../config/files";
import { getTicketFilesError } from "./ticket-files-error";

/** Файлы сообщения до отправки: проверка лимитов, превью и удаление. */
export function useTicketFiles() {
  const [selectedFiles, setSelectedFiles] = useState<LocalFile[]>([]);
  const previews = useLocalFiles();
  const { showError } = useNotifications();
  const files = selectedFiles.map((selected) => selected.file);

  /** Принимает выбранные файлы, если они проходят ограничения поддержки. */
  function addFiles(picked: FileList | null) {
    const added = picked ? [...picked] : [];

    if (added.length === 0) {
      return;
    }

    const error = getTicketFilesError(files.length, added);

    if (error) {
      showError(error);
      return;
    }

    setSelectedFiles([...selectedFiles, ...added.map(previews.createFile)]);
  }

  /** Убирает файл из сообщения и освобождает его временный адрес. */
  function removeFile(selected: LocalFile) {
    previews.removeFile(selected);
    setSelectedFiles(selectedFiles.filter((item) => item !== selected));
  }

  /** Очищает вложения после отправки сообщения. */
  function clearFiles() {
    previews.clearFiles();
    setSelectedFiles([]);
  }

  const items: FileGalleryItem[] = selectedFiles.map((selected) => ({
    id: selected.previewUrl,
    name: selected.file.name,
    url: selected.previewUrl,
    previewUrl: selected.previewUrl,
    thumbnailUrl: selected.previewUrl,
    onRemove: () => removeFile(selected),
  }));

  return {
    files,
    items,
    isFull: files.length >= TICKET_FILE_LIMIT,
    addFiles,
    clearFiles,
  };
}
