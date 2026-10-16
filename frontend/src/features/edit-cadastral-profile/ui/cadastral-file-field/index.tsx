"use client";

import { useRef } from "react";
import type { ChangeEvent } from "react";
import { CADASTRAL_DOCUMENT_ACCEPT } from "@/entities/cadastral";
import type { CadastralDocument } from "@/entities/cadastral";
import { resolveFileUrl } from "@/shared/lib/file-url";
import { FileGallery } from "@/shared/ui/file-gallery";

/** Диплом или аттестат инженера, который можно заменить новым файлом. */
interface CadastralFileFieldProps {
  label: string;
  file: CadastralDocument | null;
  isBusy: boolean;
  onUpload: (file: File) => Promise<void>;
}

/** Показывает сохранённый файл и открывает выбор его замены. */
export function CadastralFileField({
  label,
  file,
  isBusy,
  onUpload,
}: CadastralFileFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const items = file
    ? [
        {
          id: file.url,
          name: file.name,
          url: resolveFileUrl(file.url),
        },
      ]
    : [];

  /** Открывает выбор файла после завершения текущей операции. */
  function openFilePicker() {
    if (!isBusy) {
      inputRef.current?.click();
    }
  }

  /** Передаёт выбранный файл и разрешает повторно выбрать тот же документ. */
  function changeFile(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    event.target.value = "";

    if (selectedFile) {
      void onUpload(selectedFile);
    }
  }

  return (
    <FileGallery
      variant="editable"
      label={label}
      hint="PDF / JPG / PNG / DOC / DOCX, до 10 МБ; новый файл заменит прежний"
      items={items}
      onAdd={openFilePicker}
      input={
        <input
          ref={inputRef}
          type="file"
          hidden
          accept={CADASTRAL_DOCUMENT_ACCEPT}
          disabled={isBusy}
          onChange={changeFile}
        />
      }
    />
  );
}
