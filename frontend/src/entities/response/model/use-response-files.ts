"use client";

import { useState } from "react";
import type { LocalFile } from "@/shared/lib/local-file";
import { useLocalFiles } from "@/shared/lib/use-local-files";
import type { FileGalleryItem } from "@/shared/ui/file-gallery";
import { useNotifications } from "@/shared/ui/notifications";
import { mergeResponseFiles } from "./merge-response-files";

/** Хранит вложения отклика, проверяет лимиты и освобождает адреса предпросмотра. */
export function useResponseFiles() {
  const [selectedFiles, setSelectedFiles] = useState<LocalFile[]>([]);
  const previews = useLocalFiles();
  const { showError } = useNotifications();
  const files = selectedFiles.map((selected) => selected.file);

  /** Принимает выбранные файлы, не добавляя повторные и слишком большие наборы. */
  function addFiles(picked: FileList | null) {
    const result = mergeResponseFiles(files, [...(picked ?? [])]);

    if (result.error) {
      showError(result.error);
      return;
    }

    const added = result.files.slice(files.length).map(previews.createFile);
    setSelectedFiles([...selectedFiles, ...added]);
  }

  /** Убирает вложение из предложения и освобождает его временный адрес. */
  function removeFile(selected: LocalFile) {
    previews.removeFile(selected);
    setSelectedFiles(selectedFiles.filter((item) => item !== selected));
  }

  const items: FileGalleryItem[] = selectedFiles.map((selected) => ({
    id: selected.previewUrl,
    name: selected.file.name,
    url: selected.previewUrl,
    previewUrl: selected.previewUrl,
    thumbnailUrl: selected.previewUrl,
    onRemove: () => removeFile(selected),
  }));

  return { files, items, addFiles };
}
