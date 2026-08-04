"use client";

import { useRef } from "react";
import { FileGallery } from "@/source/shared/ui/FileGallery";
import {
  getFileGalleryPreviewUrl,
  getFileGalleryThumbUrl,
  isImageFileName,
} from "@/source/shared/lib/filePreview";
import { resolveFileUrl } from "@/source/shared/lib/fileUrl";
import { FILE_ACCEPT, FILE_HINT, type DirectionFile } from "../model/files";

interface Props {
  label: string;
  documents: DirectionFile[];
  isBusy: boolean;
  onUpload: (file: File) => void;
  onRemove: (url: string) => void;
}

export function SavedDocumentsField({ label, documents, isBusy, onUpload, onRemove }: Props) {
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
      hint={FILE_HINT}
      emptyText="Документы не загружены"
      items={items}
      onAdd={() => inputRef.current?.click()}
      input={
        <input
          ref={inputRef}
          type="file"
          hidden
          accept={FILE_ACCEPT}
          disabled={isBusy}
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
