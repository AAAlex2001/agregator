"use client";

import { useRef } from "react";
import type { ChangeEvent } from "react";
import type { LocalFile } from "@/shared/lib/local-file";
import { FileGallery } from "@/shared/ui/file-gallery";
import { DOCUMENT_ACCEPT, DOCUMENT_HINT } from "../../config/documents";
import type { RegistrationFiles } from "../../model/files";

/** Группа документов с ограничением количества, заданным направлением. */
interface FilesPickerProps {
  label: string;
  value: LocalFile[];
  onChange: (value: LocalFile[]) => void;
  files: RegistrationFiles;
  maxFiles?: number;
}

/** Добавляет документы в свободные места группы и освобождает удалённые файлы. */
export function FilesPicker({
  label,
  value,
  onChange,
  files,
  maxFiles = 10,
}: FilesPickerProps) {
  const input = useRef<HTMLInputElement>(null);

  /** Удаляет выбранный документ вместе с его временным адресом. */
  function removeFile(selected: LocalFile) {
    files.removeFile(selected);
    onChange(value.filter((item) => item !== selected));
  }

  /** Добавляет только доступное количество файлов и очищает поле выбора. */
  function selectFiles(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    const available = selected.slice(0, maxFiles - value.length);

    onChange([...value, ...available.map(files.createFile)]);
    event.target.value = "";
  }

  return (
    <FileGallery
      variant="editable"
      label={label}
      hint={`${DOCUMENT_HINT}, не более ${maxFiles} файлов`}
      items={value.map((selected) => ({
        id: selected.previewUrl,
        name: selected.file.name,
        url: selected.previewUrl,
        previewUrl: selected.previewUrl,
        thumbnailUrl: selected.previewUrl,
        onRemove: () => removeFile(selected),
      }))}
      onAdd={value.length < maxFiles ? () => input.current?.click() : undefined}
      input={
        <input
          ref={input}
          type="file"
          accept={DOCUMENT_ACCEPT}
          multiple
          hidden
          onChange={selectFiles}
        />
      }
    />
  );
}

