"use client";

import { useRef } from "react";
import { FileGallery } from "@/source/shared/ui/FileGallery";
import { FILE_ACCEPT, FILE_HINT, type DirectionFile } from "../model/files";
import { toGalleryItem } from "../model/galleryItem";

interface SavedFileFieldProps {
  label: string;
  file: DirectionFile | null;
  isBusy: boolean;
  onUpload: (file: File) => void;
  onRemove?: () => void;
}

/** Один файл, уже лежащий на сервере: новый файл заменяет прежний, удаление — если разрешено. */
export function SavedFileField({ label, file, isBusy, onUpload, onRemove }: SavedFileFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const items = file ? [toGalleryItem(file, isBusy ? undefined : onRemove)] : [];

  return (
    <FileGallery
      variant="editable"
      label={label}
      hint={`${FILE_HINT}; новый файл заменит прежний`}
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
            const picked = event.target.files?.[0];
            event.target.value = "";
            if (picked) onUpload(picked);
          }}
        />
      }
    />
  );
}
