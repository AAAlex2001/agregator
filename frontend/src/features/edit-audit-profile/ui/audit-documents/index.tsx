"use client";

import { useRef } from "react";
import type { ChangeEvent } from "react";
import {
  AUDIT_DOCUMENT_ACCEPT,
  AUDIT_DOCUMENT_LIMIT,
  useAuditExpertProfile,
  useDeleteAuditDocument,
  useUploadAuditDocuments,
} from "@/entities/audit";
import type { AuditDocument } from "@/entities/audit";
import { resolveFileUrl } from "@/shared/lib/file-url";
import { FileGallery } from "@/shared/ui/file-gallery";
import type { FileGalleryItem } from "@/shared/ui/file-gallery";

/** Показывает и изменяет дипломы, аттестаты и документы о курсах аудитора. */
export function AuditDocuments() {
  const { profile, operation } = useAuditExpertProfile();
  const uploadDocuments = useUploadAuditDocuments();
  const removeDocument = useDeleteAuditDocument();
  const inputRef = useRef<HTMLInputElement>(null);
  const isBusy = operation !== "idle";

  /** Связывает просмотр документа с удалением по его исходному адресу. */
  function createGalleryItem(document: AuditDocument): FileGalleryItem {
    /** Удаляет выбранный документ аудитора. */
    function remove() {
      void removeDocument(document.url);
    }

    return {
      id: document.url,
      name: document.name,
      url: resolveFileUrl(document.url),
      onRemove: isBusy ? undefined : remove,
    };
  }

  /** Открывает выбор документов после завершения текущей операции. */
  function openFilePicker() {
    if (!isBusy) {
      inputRef.current?.click();
    }
  }

  /** Берёт документы на свободные места и очищает поле для повторного выбора. */
  function changeFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).slice(
      0,
      AUDIT_DOCUMENT_LIMIT - profile.documents.length,
    );
    event.target.value = "";

    if (files.length > 0) {
      void uploadDocuments(files);
    }
  }

  return (
    <FileGallery
      variant="editable"
      label="Дипломы, аттестаты, курсы"
      hint="PDF / JPG / PNG / DOC / DOCX, до 10 МБ, не более 10 файлов"
      emptyText="Документы не загружены"
      items={profile.documents.map(createGalleryItem)}
      onAdd={
        profile.documents.length < AUDIT_DOCUMENT_LIMIT
          ? openFilePicker
          : undefined
      }
      input={
        <input
          ref={inputRef}
          type="file"
          hidden
          multiple
          accept={AUDIT_DOCUMENT_ACCEPT}
          disabled={isBusy}
          onChange={changeFiles}
        />
      }
    />
  );
}
