"use client";

import { useRef } from "react";
import type { ChangeEvent } from "react";
import {
  FORENSIC_DOCUMENT_ACCEPT,
  FORENSIC_DOCUMENT_LIMIT,
  useDeleteForensicDocument,
  useForensicProfile,
  useUploadForensicDocuments,
} from "@/entities/forensic";
import type { ForensicDocument } from "@/entities/forensic";
import { resolveFileUrl } from "@/shared/lib/file-url";
import { FileGallery } from "@/shared/ui/file-gallery";
import type { FileGalleryItem } from "@/shared/ui/file-gallery";

/** Показывает и изменяет документы о дополнительном образовании эксперта. */
export function ForensicDocuments() {
  const { profile, operation } = useForensicProfile();
  const uploadDocuments = useUploadForensicDocuments();
  const removeDocument = useDeleteForensicDocument();
  const inputRef = useRef<HTMLInputElement>(null);
  const isBusy = operation !== "idle";

  /** Связывает просмотр документа с удалением по его исходному адресу. */
  function createGalleryItem(document: ForensicDocument): FileGalleryItem {
    /** Удаляет выбранный документ об образовании. */
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
      FORENSIC_DOCUMENT_LIMIT - profile.documents.length,
    );
    event.target.value = "";

    if (files.length > 0) {
      void uploadDocuments(files);
    }
  }

  return (
    <FileGallery
      variant="editable"
      label="Документы о дополнительном образовании"
      hint="PDF / JPG / PNG / DOC / DOCX, до 10 МБ, не более 10 файлов"
      emptyText="Документы не загружены"
      items={profile.documents.map(createGalleryItem)}
      onAdd={
        profile.documents.length < FORENSIC_DOCUMENT_LIMIT
          ? openFilePicker
          : undefined
      }
      input={
        <input
          ref={inputRef}
          type="file"
          hidden
          multiple
          accept={FORENSIC_DOCUMENT_ACCEPT}
          disabled={isBusy}
          onChange={changeFiles}
        />
      }
    />
  );
}
