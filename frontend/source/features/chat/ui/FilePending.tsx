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
  file: File;
  onRemove: () => void;
}

export function FilePending({ file, onRemove }: FilePendingProps) {
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    const nextPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(nextPreviewUrl);

    return () => {
      URL.revokeObjectURL(nextPreviewUrl);
    };
  }, [file]);

  const isImage = isImageFileName(file.name);
  const items: FileGalleryItem[] = previewUrl ? [{
    id: `pending-${file.name}-${file.lastModified}`,
    name: file.name,
    url: previewUrl,
    previewUrl: isImage ? previewUrl : getFileGalleryPreviewUrl(previewUrl, file.name),
    thumbnailUrl: getFileGalleryThumbUrl(previewUrl, file.name),
    isImage,
    onRemove,
  }] : [];

  return (
    <FileGallery
      items={items}
      hideWhenEmpty
      variant="editable"
      blockClassName={s.filePending}
      hint="PDF, JPEG, PNG, DOC, DOCX, XLS, XLSX"
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