"use client";

import { useRef } from "react";
import type { ChangeEvent } from "react";
import {
  ECOLOGY_DOCUMENT_ACCEPT,
  ECOLOGY_DOCUMENT_LIMIT,
  useDeleteEcologyDocument,
  useEcologyProfile,
  useUploadEcologyDocuments,
} from "@/entities/ecology";
import type { EcologyDocument } from "@/entities/ecology";
import { resolveFileUrl } from "@/shared/lib/file-url";
import { FileGallery } from "@/shared/ui/file-gallery";
import type { FileGalleryItem } from "@/shared/ui/file-gallery";

/** Показывает документы о квалификации и передаёт выбор файлов операциям анкеты. */
export function EcologyDocuments() {
  const { profile, operation } = useEcologyProfile();
  const uploadDocuments = useUploadEcologyDocuments();
  const removeDocument = useDeleteEcologyDocument();
  const inputRef = useRef<HTMLInputElement>(null);
  const isBusy = operation !== "idle";

  /** Связывает файл галереи с его исходным адресом для удаления. */
  function createGalleryItem(document: EcologyDocument): FileGalleryItem {
    /** Удаляет выбранный документ по адресу из API. */
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

  /** Открывает нативный выбор файлов, если другая операция уже завершилась. */
  function openFilePicker() {
    if (!isBusy) {
      inputRef.current?.click();
    }
  }

  /** Берёт только свободные места в анкете и очищает поле для повторного выбора. */
  function changeFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).slice(
      0,
      ECOLOGY_DOCUMENT_LIMIT - profile.documents.length,
    );
    event.target.value = "";

    if (files.length > 0) {
      void uploadDocuments(files);
    }
  }

  return (
    <FileGallery
      variant="editable"
      label="Подтверждение квалификационных требований — до 10 документов"
      hint="PDF / JPG / PNG / DOC / DOCX, до 10 МБ, не более 10 файлов"
      emptyText="Документы не загружены"
      items={profile.documents.map(createGalleryItem)}
      onAdd={
        profile.documents.length < ECOLOGY_DOCUMENT_LIMIT
          ? openFilePicker
          : undefined
      }
      input={
        <input
          ref={inputRef}
          type="file"
          hidden
          multiple
          accept={ECOLOGY_DOCUMENT_ACCEPT}
          disabled={isBusy}
          onChange={changeFiles}
        />
      }
    />
  );
}
