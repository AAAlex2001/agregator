"use client";

import { useState } from "react";
import { mergeFilesWithLimits } from "@/source/shared/lib/fileUploadValidation";
import { localFileItem } from "@/source/shared/lib/localFile";
import { useNotifications } from "@/source/shared/ui/Notifications";
import type { FileGalleryItem } from "@/source/shared/ui/FileGallery";

export interface BidFiles {
  files: File[];
  items: FileGalleryItem[];
  add: (picked: FileList | null) => void;
  clear: () => void;
}

/** Файлы к отклику до отправки: лимиты по числу и размеру, превью, удаление. */
export function useBidFiles(): BidFiles {
  const { showError } = useNotifications();
  const [files, setFiles] = useState<File[]>([]);

  const add = (picked: FileList | null) => {
    const result = mergeFilesWithLimits(files, Array.from(picked ?? []));
    if (result.errorMessage) showError(result.errorMessage);
    else setFiles(result.nextFiles);
  };

  return {
    files,
    items: files.map((file) => localFileItem(file, () => setFiles(files.filter((item) => item !== file)))),
    add,
    clear: () => setFiles([]),
  };
}
