"use client";

import { useRef } from "react";
import type { ChangeEvent } from "react";
import {
  CADASTRAL_DOCUMENT_ACCEPT,
  CADASTRAL_DOCUMENT_LIMIT,
  useCadastralProfile,
  useDeleteCadastralDocument,
  useUploadCadastralDocuments,
} from "@/entities/cadastral";
import type { CadastralDocument } from "@/entities/cadastral";
import { resolveFileUrl } from "@/shared/lib/file-url";
import { FileGallery } from "@/shared/ui/file-gallery";
import type { FileGalleryItem } from "@/shared/ui/file-gallery";

/** Показывает дополнительные дипломы, аттестаты и свидетельства о курсах. */
export function CadastralDocuments() {
  const { profile, operation } = useCadastralProfile();
  const uploadDocuments = useUploadCadastralDocuments();
  const removeDocument = useDeleteCadastralDocument();
  const inputRef = useRef<HTMLInputElement>(null);
  const isBusy = operation !== "idle";

  /** Связывает просмотр файла с удалением по его исходному адресу из API. */
  function createGalleryItem(document: CadastralDocument): FileGalleryItem {
    /** Удаляет выбранный документ из анкеты. */
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

  /** Открывает выбор документов после завершения текущего запроса. */
  function openFilePicker() {
    if (!isBusy) {
      inputRef.current?.click();
    }
  }

  /** Ограничивает выбор свободными местами в анкете и очищает поле файла. */
  function changeFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).slice(
      0,
      CADASTRAL_DOCUMENT_LIMIT - profile.documents.length,
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
        profile.documents.length < CADASTRAL_DOCUMENT_LIMIT
          ? openFilePicker
          : undefined
      }
      input={
        <input
          ref={inputRef}
          type="file"
          hidden
          multiple
          accept={CADASTRAL_DOCUMENT_ACCEPT}
          disabled={isBusy}
          onChange={changeFiles}
        />
      }
    />
  );
}
