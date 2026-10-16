"use client";

import { useRef } from "react";
import type { ChangeEvent } from "react";
import type { LocalFile } from "@/shared/lib/local-file";
import { FileGallery } from "@/shared/ui/file-gallery";
import { DOCUMENT_ACCEPT, DOCUMENT_HINT } from "../../config/documents";
import type { RegistrationFiles } from "../../model/files";

/** Выбранный документ и действия владельца его временного адреса. */
interface FilePickerProps {
  label: string;
  value: LocalFile | null;
  onChange: (value: LocalFile | null) => void;
  files: RegistrationFiles;
  accept?: string;
  hint?: string;
}

/** Выбирает или заменяет один файл с просмотром до отправки регистрации. */
export function FilePicker({
  label,
  value,
  onChange,
  files,
  accept = DOCUMENT_ACCEPT,
  hint = DOCUMENT_HINT,
}: FilePickerProps) {
  const input = useRef<HTMLInputElement>(null);

  /** Освобождает адрес предыдущего файла перед заменой. */
  function selectFile(file: File | null) {
    if (value) {
      files.removeFile(value);
    }

    onChange(file ? files.createFile(file) : null);
  }

  /** Заменяет документ выбранным файлом и очищает браузерное поле выбора. */
  function changeFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      selectFile(file);
    }

    event.target.value = "";
  }

  return (
    <FileGallery
      variant="editable"
      label={label}
      hint={hint}
      items={value ? [{
        id: value.previewUrl,
        name: value.file.name,
        url: value.previewUrl,
        previewUrl: value.previewUrl,
        thumbnailUrl: value.previewUrl,
        onRemove: () => selectFile(null),
      }] : []}
      onAdd={() => input.current?.click()}
      input={
        <input
          ref={input}
          type="file"
          accept={accept}
          hidden
          onChange={changeFile}
        />
      }
    />
  );
}

