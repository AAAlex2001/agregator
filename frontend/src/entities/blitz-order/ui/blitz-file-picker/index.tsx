"use client";

import { useRef } from "react";
import { FileGallery } from "@/shared/ui/file-gallery";
import type { FileGalleryItem } from "@/shared/ui/file-gallery";
import { BLITZ_FILE_ACCEPT, BLITZ_FILES_HINT } from "../../config/files";

/** Выбранные файлы, подпись поля и действия выбора. */
interface BlitzFilePickerProps {
  label: string;
  items: FileGalleryItem[];
  isFull: boolean;
  onAdd: (files: FileList | null) => void;
  accept?: string;
  multiple?: boolean;
  hint?: string;
}

/** Файлы до отправки: превью, удаление и кнопка выбора. */
export function BlitzFilePicker({
  label,
  items,
  isFull,
  onAdd,
  accept = BLITZ_FILE_ACCEPT,
  multiple = true,
  hint = BLITZ_FILES_HINT,
}: BlitzFilePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <FileGallery
      items={items}
      label={label}
      hint={hint}
      variant="editable"
      onAdd={isFull ? undefined : () => inputRef.current?.click()}
      input={
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          hidden
          accept={accept}
          onChange={(event) => {
            onAdd(event.currentTarget.files);
            event.currentTarget.value = "";
          }}
        />
      }
    />
  );
}
