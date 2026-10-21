"use client";

import { useState } from "react";
import type { LocalFile } from "@/shared/lib/local-file";
import { useLocalFiles } from "@/shared/lib/use-local-files";
import type { FileGalleryItem } from "@/shared/ui/file-gallery";
import { useNotifications } from "@/shared/ui/notifications";
import { BLITZ_FILE_LIMIT, BLITZ_FILE_MAX_SIZE } from "../config/files";

/** Файлы до отправки: проверка лимитов, превью и удаление. */
export function useBlitzFiles(limit = BLITZ_FILE_LIMIT, maxSize = BLITZ_FILE_MAX_SIZE) {
  const [selectedFiles, setSelectedFiles] = useState<LocalFile[]>([]);
  const previews = useLocalFiles();
  const { showError } = useNotifications();
  const files = selectedFiles.map((selected) => selected.file);

  /** Принимает выбранные файлы, если они проходят по количеству и размеру. */
  function addFiles(picked: FileList | null) {
    const added = picked ? [...picked] : [];

    if (files.length + added.length > limit) {
      showError(`Можно приложить не больше ${limit} файлов`);
      return;
    }

    if (added.some((file) => file.size > maxSize)) {
      showError(`Файл больше ${Math.round(maxSize / 1024 / 1024)} МБ не поддерживается`);
      return;
    }

    setSelectedFiles([...selectedFiles, ...added.map(previews.createFile)]);
  }

  /** Убирает файл и освобождает его временный адрес. */
  function removeFile(selected: LocalFile) {
    previews.removeFile(selected);
    setSelectedFiles(selectedFiles.filter((item) => item !== selected));
  }

  /** Очищает файлы после отправки. */
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
    isFull: files.length >= limit,
    addFiles,
    clearFiles,
  };
}
