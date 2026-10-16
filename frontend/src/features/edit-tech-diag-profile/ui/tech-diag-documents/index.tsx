"use client";

import { useRef } from "react";
import type { ChangeEvent } from "react";
import {
  TECH_DIAG_DOCUMENT_ACCEPT,
  TECH_DIAG_DOCUMENT_LIMIT,
  useDeleteTechDiagDocument,
  useTechDiagProfile,
  useUploadTechDiagDocuments,
} from "@/entities/tech-diag";
import type { TechDiagDocument } from "@/entities/tech-diag";
import { resolveFileUrl } from "@/shared/lib/file-url";
import { FileGallery } from "@/shared/ui/file-gallery";
import type { FileGalleryItem } from "@/shared/ui/file-gallery";

/** Показывает и изменяет квалификационные удостоверения специалиста НК. */
export function TechDiagDocuments() {
  const { profile, operation } = useTechDiagProfile();
  const uploadDocuments = useUploadTechDiagDocuments();
  const removeDocument = useDeleteTechDiagDocument();
  const inputRef = useRef<HTMLInputElement>(null);
  const isBusy = operation !== "idle";

  /** Связывает просмотр удостоверения с удалением по его исходному адресу. */
  function createGalleryItem(document: TechDiagDocument): FileGalleryItem {
    /** Удаляет выбранное удостоверение специалиста. */
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

  /** Открывает выбор удостоверений после завершения текущей операции. */
  function openFilePicker() {
    if (!isBusy) {
      inputRef.current?.click();
    }
  }

  /** Берёт документы на свободные места и очищает поле для повторного выбора. */
  function changeFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).slice(
      0,
      TECH_DIAG_DOCUMENT_LIMIT - profile.documents.length,
    );
    event.target.value = "";

    if (files.length > 0) {
      void uploadDocuments(files);
    }
  }

  return (
    <FileGallery
      variant="editable"
      label="Квалификационные удостоверения — до 10 документов"
      hint="PDF / JPG / PNG / DOC / DOCX, до 10 МБ, не более 10 файлов"
      emptyText="Документы не загружены"
      items={profile.documents.map(createGalleryItem)}
      onAdd={
        profile.documents.length < TECH_DIAG_DOCUMENT_LIMIT
          ? openFilePicker
          : undefined
      }
      input={
        <input
          ref={inputRef}
          type="file"
          hidden
          multiple
          accept={TECH_DIAG_DOCUMENT_ACCEPT}
          disabled={isBusy}
          onChange={changeFiles}
        />
      }
    />
  );
}
