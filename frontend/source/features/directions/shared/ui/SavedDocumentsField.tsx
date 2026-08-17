"use client";

import { useRef } from "react";
import { FileGallery } from "@/source/shared/ui/FileGallery";
import {
  getFileGalleryPreviewUrl,
  getFileGalleryThumbUrl,
  isImageFileName,
} from "@/source/shared/lib/filePreview";
import { resolveFileUrl } from "@/source/shared/lib/fileUrl";
import { FILE_ACCEPT, FILE_HINT, MAX_PROFILE_DOCUMENTS, type DirectionFile } from "../model/files";

interface Props {
  label: string;
  documents: DirectionFile[];
  isBusy: boolean;
  onUpload: (files: File[]) => void;
  onRemove: (url: string) => void;
  maxFiles?: number;
}

export function SavedDocumentsField({
  label,
  documents,
  isBusy,
  onUpload,
  onRemove,
  maxFiles = MAX_PROFILE_DOCUMENTS,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const items = documents.map((document) => {
    const resolved = resolveFileUrl(document.url);
    const isImage = isImageFileName(document.name);
    return {
      id: document.url,
      name: document.name,
      url: resolved,
      previewUrl: isImage ? resolved : getFileGalleryPreviewUrl(resolved, document.name),
      thumbnailUrl: getFileGalleryThumbUrl(resolved, document.name),
      isImage,
      onRemove: isBusy ? undefined : () => onRemove(document.url),
    };
  });

  return (
    <FileGallery
      variant="editable"
      label={label}
      hint={`${FILE_HINT}, не более ${maxFiles} файлов`}
      emptyText="Документы не загружены"
      items={items}
      onAdd={documents.length < maxFiles ? () => inputRef.current?.click() : undefined}
      input={
        <input
          ref={inputRef}
          type="file"
          hidden
          multiple
          accept={FILE_ACCEPT}
          disabled={isBusy}
          onChange={(event) => {
            const files = Array.from(event.target.files ?? []).slice(0, maxFiles - documents.length);
            event.target.value = "";
            if (files.length) onUpload(files);
          }}
        />
      }
    />
  );
}
