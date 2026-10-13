"use client";

import { useRef } from "react";
import { FileGallery } from "@/source/shared/ui/FileGallery";
import { localFileItem } from "@/source/shared/lib/localFile";
import { FILE_ACCEPT, FILE_HINT } from "../model/files";

interface LocalFilePickerProps {
  label: string;
  file: File | null;
  onSelect: (file: File | null) => void;
  accept?: string;
  hint?: string;
}

/** Один файл до отправки формы: выбор, превью и удаление. Пока файл не отправлен, он живёт только в памяти браузера. */
export function LocalFilePicker({ label, file, onSelect, accept = FILE_ACCEPT, hint = FILE_HINT }: LocalFilePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <FileGallery
      variant="editable"
      label={label}
      hint={hint}
      items={file ? [localFileItem(file, () => onSelect(null))] : []}
      onAdd={() => inputRef.current?.click()}
      input={
        <input
          ref={inputRef}
          type="file"
          hidden
          accept={accept}
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
