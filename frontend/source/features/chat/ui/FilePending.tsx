"use client";

import { useEffect, useState } from "react";
import {
  getFileGalleryPreviewUrl,
  getFileGalleryThumbUrl,
  isImageFileName,
} from "@/source/shared/lib/filePreview";
import { FileGallery } from "@/source/shared/ui/FileGallery";
import type { FileGalleryItem } from "@/source/shared/ui/FileGallery";
import s from "./FilePending.module.scss";

interface FilePendingProps {
  files: File[];
  onRemove: (index: number) => void;
}

interface PreviewItem {
  file: File;
  url: string;
}

export function FilePending({ files, onRemove }: FilePendingProps) {
  const [previews, setPreviews] = useState<PreviewItem[]>([]);

  useEffect(() => {
    const nextPreviews = files.map((file) => ({ file, url: URL.createObjectURL(file) }));
    setPreviews(nextPreviews);

    return () => {
      nextPreviews.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [files]);

  const items: FileGalleryItem[] = files.map((file, index) => {
    const preview = previews.find((item) => item.file === file);
    const url = preview?.url ?? "";
    const isImage = isImageFileName(file.name);

    return {
      id: `pending-${file.name}-${file.lastModified}-${index}`,
      name: file.name,
      url,
      previewUrl: isImage ? url : getFileGalleryPreviewUrl(url, file.name),
      thumbnailUrl: getFileGalleryThumbUrl(url, file.name),
      isImage,
      onRemove: () => onRemove(index),
    };
  }).filter((item) => item.url);

  return (
    <FileGallery
      items={items}
      hideWhenEmpty
      variant="editable"
      blockClassName={s.filePending}
      hint="До 6 файлов: PDF, JPEG, PNG, DOC, DOCX, XLS, XLSX"
      hintClassName={s.hint}
    />
  );
}

export function UploadProgress({ percent }: { percent: number }) {
  return (
    <div className={s.progress}>
      <div className={s.progressBar} style={{ width: `${percent}%` }} />
      <span className={s.progressText}>{percent}%</span>
    </div>
  );
}