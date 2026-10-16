"use client";

import { useRef } from "react";
import type { ChangeEvent } from "react";
import {
  FORENSIC_DOCUMENT_ACCEPT,
  useForensicProfile,
  useUploadForensicDiploma,
} from "@/entities/forensic";
import { resolveFileUrl } from "@/shared/lib/file-url";
import { FileGallery } from "@/shared/ui/file-gallery";

/** Показывает диплом судебного эксперта и позволяет заменить его новым файлом. */
export function ForensicDiploma() {
  const { profile, operation } = useForensicProfile();
  const uploadDiploma = useUploadForensicDiploma();
  const inputRef = useRef<HTMLInputElement>(null);
  const isBusy = operation !== "idle";
  const diploma = profile.education_diploma;
  const items = diploma
    ? [
        {
          id: diploma.url,
          name: diploma.name,
          url: resolveFileUrl(diploma.url),
        },
      ]
    : [];

  /** Открывает выбор диплома после завершения текущего запроса. */
  function openFilePicker() {
    if (!isBusy) {
      inputRef.current?.click();
    }
  }

  /** Передаёт новый диплом и очищает поле для повторного выбора файла. */
  function changeFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (file) {
      void uploadDiploma(file);
    }
  }

  return (
    <FileGallery
      variant="editable"
      label="Диплом об образовании"
      hint="PDF / JPG / PNG / DOC / DOCX, до 10 МБ; новый файл заменит прежний"
      items={items}
      onAdd={openFilePicker}
      input={
        <input
          ref={inputRef}
          type="file"
          hidden
          accept={FORENSIC_DOCUMENT_ACCEPT}
          disabled={isBusy}
          onChange={changeFile}
        />
      }
    />
  );
}
