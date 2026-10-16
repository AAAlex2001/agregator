"use client";

import { useRef } from "react";
import type { ChangeEvent } from "react";
import {
  SRO_DOCUMENT_ACCEPT,
  SRO_DOCUMENT_LIMIT,
  useDeleteSroDocument,
  useSroProfile,
  useUploadSroDocuments,
} from "@/entities/sro";
import type { SroDocument } from "@/entities/sro";
import { resolveFileUrl } from "@/shared/lib/file-url";
import { FileGallery } from "@/shared/ui/file-gallery";
import type { FileGalleryItem } from "@/shared/ui/file-gallery";

/** Показывает и изменяет дополнительные документы члена СРО. */
export function SroDocuments() {
  const { profile, operation } = useSroProfile();
  const uploadDocuments = useUploadSroDocuments();
  const removeDocument = useDeleteSroDocument();
  const inputRef = useRef<HTMLInputElement>(null);
  const isBusy = operation !== "idle";

  /** Связывает просмотр документа с удалением по его исходному адресу. */
  function createGalleryItem(document: SroDocument): FileGalleryItem {
    /** Удаляет выбранный документ члена СРО. */
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
      SRO_DOCUMENT_LIMIT - profile.documents.length,
    );
    event.target.value = "";

    if (files.length > 0) {
      void uploadDocuments(files);
    }
  }

  return (
    <FileGallery
      variant="editable"
      label="Дополнительные документы — до 10 файлов"
      hint="PDF / JPG / PNG / DOC / DOCX, до 10 МБ, не более 10 файлов"
      emptyText="Документы не загружены"
      items={profile.documents.map(createGalleryItem)}
      onAdd={
        profile.documents.length < SRO_DOCUMENT_LIMIT
          ? openFilePicker
          : undefined
      }
      input={
        <input
          ref={inputRef}
          type="file"
          hidden
          multiple
          accept={SRO_DOCUMENT_ACCEPT}
          disabled={isBusy}
          onChange={changeFiles}
        />
      }
    />
  );
}
