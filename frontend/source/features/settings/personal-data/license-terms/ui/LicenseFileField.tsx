"use client";

import { useRef } from "react";
import { FileGallery, type FileGalleryItem } from "@/source/shared/ui/FileGallery";
import {
  getFileDisplayName,
  getFileGalleryPreviewUrl,
  getFileGalleryThumbUrl,
  isImageFileName,
} from "@/source/shared/lib/filePreview";
import { resolveFileUrl } from "@/source/shared/lib/fileUrl";

interface LicenseFileFieldProps {
  label: string;
  hint: string;
  accept: string;
  fileUrl: string | null;
  isUploading: boolean;
  onUpload: (file: File) => void;
  onRemove?: () => void;
}

/** Загруженный файл в виде карточки галереи: имя, ссылка, превью. */
function toGalleryItem(fileUrl: string, label: string, onRemove?: () => void): FileGalleryItem {
  const url = resolveFileUrl(fileUrl);
  const name = getFileDisplayName(fileUrl, label);
  const isImage = isImageFileName(name);

  return {
    id: fileUrl,
    name,
    url,
    previewUrl: isImage ? url : getFileGalleryPreviewUrl(url, name),
    thumbnailUrl: getFileGalleryThumbUrl(url, name),
    isImage,
    onRemove,
  };
}

/** Один файл держателя документов: превью загруженного, замена и, если можно, удаление. */
export function LicenseFileField({ label, hint, accept, fileUrl, isUploading, onUpload, onRemove }: LicenseFileFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const items = fileUrl ? [toGalleryItem(fileUrl, label, onRemove)] : [];

  return (
    <FileGallery
      label={isUploading ? "Загрузка файла…" : label}
      hint={hint}
      items={items}
      variant="editable"
      onAdd={() => inputRef.current?.click()}
      input={
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) onUpload(file);
          }}
        />
      }
    />
  );
}
