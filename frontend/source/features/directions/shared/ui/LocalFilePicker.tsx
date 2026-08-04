"use client";

import { useRef } from "react";
import { FileGallery, type FileGalleryItem } from "@/source/shared/ui/FileGallery";
import { isImageFileName } from "@/source/shared/lib/filePreview";
import { useObjectUrl } from "@/source/shared/lib/useObjectUrl";
import { FILE_ACCEPT, FILE_HINT } from "../model/files";

interface Props {
  label: string;
  file: File | null;
  onSelect: (file: File | null) => void;
}

export function LocalFilePicker({ label, file, onSelect }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const blobUrl = useObjectUrl(file);

  const items: FileGalleryItem[] =
    file && blobUrl
      ? [
          {
            id: `${label}-local`,
            name: file.name,
            url: blobUrl,
            previewUrl: blobUrl,
            thumbnailUrl: blobUrl,
            isImage: isImageFileName(file.name),
            onRemove: () => onSelect(null),
          },
        ]
      : [];

  return (
    <FileGallery
      variant="editable"
      label={label}
      hint={FILE_HINT}
      items={items}
      onAdd={() => inputRef.current?.click()}
      input={
        <input
          ref={inputRef}
          type="file"
          hidden
          accept={FILE_ACCEPT}
          onChange={(event) => {
            const picked = event.target.files?.[0] ?? null;
            event.target.value = "";
            if (picked) onSelect(picked);
          }}
        />
      }
    />
  );
}
