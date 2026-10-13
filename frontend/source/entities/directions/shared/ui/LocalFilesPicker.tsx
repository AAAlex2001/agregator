"use client";

import { useRef } from "react";
import { FileGallery } from "@/source/shared/ui/FileGallery";
import { localFileItem } from "@/source/shared/lib/localFile";
import { FILE_ACCEPT, FILE_HINT, MAX_PROFILE_DOCUMENTS } from "../model/files";

interface LocalFilesPickerProps {
  label: string;
  files: File[];
  onAdd: (files: File[]) => void;
  onRemove: (file: File) => void;
  maxFiles?: number;
}

/** Несколько файлов до отправки формы: выбор, превью и удаление, пока они живут только в памяти браузера. */
export function LocalFilesPicker({ label, files, onAdd, onRemove, maxFiles = MAX_PROFILE_DOCUMENTS }: LocalFilesPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <FileGallery
      variant="editable"
      label={label}
      hint={`${FILE_HINT}, не более ${maxFiles} файлов`}
      items={files.map((file) => localFileItem(file, () => onRemove(file)))}
      onAdd={files.length < maxFiles ? () => inputRef.current?.click() : undefined}
      input={
        <input
          ref={inputRef}
          type="file"
          hidden
          multiple
          accept={FILE_ACCEPT}
          onChange={(event) => {
            const picked = Array.from(event.target.files ?? []);
            event.target.value = "";
            if (picked.length) onAdd(picked.slice(0, maxFiles - files.length));
          }}
        />
      }
    />
  );
}
