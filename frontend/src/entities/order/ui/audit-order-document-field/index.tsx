"use client";

import { useRef } from "react";
import type { ChangeEvent } from "react";
import { resolveFileUrl } from "@/shared/lib/file-url";
import { FileGallery } from "@/shared/ui/file-gallery";
import {
  AUDIT_ORDER_DOCUMENT_ACCEPT,
  AUDIT_ORDER_DOCUMENT_HINT,
} from "../../config/audit-documents";
import type { AuditOrderDocument } from "../../model/details/audit";
import { useUploadAuditOrderDocument } from "../../model/use-upload-audit-order-document";

/** СТО или свидетельство ОПО, прикреплённое к условиям заказа. */
interface AuditOrderDocumentFieldProps {
  label: string;
  value: AuditOrderDocument | null;
  onChange: (document: AuditOrderDocument | null) => void;
}

/** Загружает выбранный документ сразу и показывает его в галерее. */
export function AuditOrderDocumentField({
  label,
  value,
  onChange,
}: AuditOrderDocumentFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { isUploading, uploadDocument } = useUploadAuditOrderDocument(onChange);
  const items = value
    ? [
        {
          id: value.url,
          name: value.name,
          url: resolveFileUrl(value.url),
          onRemove: isUploading ? undefined : removeDocument,
        },
      ]
    : [];

  /** Убирает ссылку из условий заказа без удаления файла на сервере. */
  function removeDocument() {
    onChange(null);
  }

  /** Открывает системный выбор документа. */
  function openFilePicker() {
    inputRef.current?.click();
  }

  /** Загружает первый выбранный файл и разрешает повторный выбор того же файла. */
  function changeDocument(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (file) {
      void uploadDocument(file);
    }
  }

  return (
    <FileGallery
      variant="editable"
      label={label}
      hint={AUDIT_ORDER_DOCUMENT_HINT}
      items={items}
      onAdd={openFilePicker}
      input={
        <input
          ref={inputRef}
          type="file"
          hidden
          accept={AUDIT_ORDER_DOCUMENT_ACCEPT}
          disabled={isUploading}
          onChange={changeDocument}
        />
      }
    />
  );
}
