"use client";

import { useRef } from "react";
import type { ChangeEvent } from "react";
import type { LicenseDocumentKind } from "@/entities/user";
import { getFileDisplayName, resolveFileUrl } from "@/shared/lib/file-url";
import { FileGallery } from "@/shared/ui/file-gallery";
import { useLicenseDocumentField } from "../../model/use-license-document-field";

/** Документ лицензии, его подпись и разрешённые форматы загрузки. */
interface LicenseDocumentFieldProps {
  kind: LicenseDocumentKind;
  label: string;
  hint: string;
  accept: string;
  fileUrl: string | null;
}

/** Показывает документ, замену файла и удаление карточки предприятия. */
export function LicenseDocumentField({
  kind,
  label,
  hint,
  accept,
  fileUrl,
}: LicenseDocumentFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { isUploading, uploadDocument, removeDocument } = useLicenseDocumentField(kind);
  const items = fileUrl
    ? [
        {
          id: fileUrl,
          name: getFileDisplayName(fileUrl, label),
          url: resolveFileUrl(fileUrl),
          onRemove: kind === "companyCard" ? removeDocument : undefined,
        },
      ]
    : [];

  /** Открывает системное окно выбора файла. */
  function openFilePicker() {
    inputRef.current?.click();
  }

  /** Загружает выбранный файл и разрешает повторно выбрать его при ошибке. */
  function changeDocument(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (file) {
      void uploadDocument(file);
    }
  }

  return (
    <FileGallery
      label={isUploading ? "Загрузка файла…" : label}
      hint={hint}
      items={items}
      variant="editable"
      onAdd={openFilePicker}
      input={
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          hidden
          onChange={changeDocument}
        />
      }
    />
  );
}
