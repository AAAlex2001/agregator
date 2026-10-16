"use client";

import { useRef } from "react";
import type { ChangeEvent } from "react";
import {
  DESIGN_DOCUMENT_ACCEPT,
  DESIGN_DOCUMENT_LIMIT,
  useDeleteDesignDocument,
  useDesignProfile,
  useUploadDesignDocuments,
} from "@/entities/design";
import type { DesignDocument, DesignDocumentGroup } from "@/entities/design";
import { resolveFileUrl } from "@/shared/lib/file-url";
import { FileGallery } from "@/shared/ui/file-gallery";
import type { FileGalleryItem } from "@/shared/ui/file-gallery";

/** Группа сохранённых документов проектировщика с её подписью. */
interface DocumentGroupProps {
  group: DesignDocumentGroup;
  label: string;
  documents: DesignDocument[];
}

/** Показывает документы группы и передаёт добавление и удаление в операции анкеты. */
export function DocumentGroup({
  group,
  label,
  documents,
}: DocumentGroupProps) {
  const { operation } = useDesignProfile();
  const uploadDocuments = useUploadDesignDocuments();
  const removeDocument = useDeleteDesignDocument();
  const inputRef = useRef<HTMLInputElement>(null);
  const isBusy = operation !== "idle";

  /** Связывает просмотр файла с удалением по его исходному адресу. */
  function createGalleryItem(document: DesignDocument): FileGalleryItem {
    /** Удаляет выбранный файл из его группы документов. */
    function remove() {
      void removeDocument(group, document.url);
    }

    return {
      id: document.url,
      name: document.name,
      url: resolveFileUrl(document.url),
      onRemove: isBusy ? undefined : remove,
    };
  }

  /** Открывает выбор документов, пока операция с анкетой не выполняется. */
  function openFilePicker() {
    if (!isBusy) {
      inputRef.current?.click();
    }
  }

  /** Загружает выбранные файлы в пределах свободных мест группы. */
  function changeFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).slice(
      0,
      DESIGN_DOCUMENT_LIMIT - documents.length,
    );
    event.target.value = "";

    if (files.length > 0) {
      void uploadDocuments(group, files);
    }
  }

  return (
    <FileGallery
      variant="editable"
      label={label}
      hint="PDF / JPG / PNG / DOC / DOCX, до 10 МБ, не более 5 файлов"
      emptyText="Документы не загружены"
      items={documents.map(createGalleryItem)}
      onAdd={
        documents.length < DESIGN_DOCUMENT_LIMIT
          ? openFilePicker
          : undefined
      }
      input={
        <input
          ref={inputRef}
          type="file"
          hidden
          multiple
          accept={DESIGN_DOCUMENT_ACCEPT}
          disabled={isBusy}
          onChange={changeFiles}
        />
      }
    />
  );
}
