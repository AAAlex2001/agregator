"use client";

import { useRef } from "react";
import type { ChangeEvent } from "react";
import {
  SURVEY_DOCUMENT_ACCEPT,
  SURVEY_DOCUMENT_LIMIT,
  useDeleteSurveyDocument,
  useSurveyProfile,
  useUploadSurveyDocuments,
} from "@/entities/survey";
import type { SurveyDocument, SurveyDocumentGroup } from "@/entities/survey";
import { resolveFileUrl } from "@/shared/lib/file-url";
import { FileGallery } from "@/shared/ui/file-gallery";
import type { FileGalleryItem } from "@/shared/ui/file-gallery";

/** Группа сохранённых документов изыскателя с её подписью. */
interface DocumentGroupProps {
  group: SurveyDocumentGroup;
  label: string;
  documents: SurveyDocument[];
}

/** Показывает файлы группы и подключает их загрузку и удаление. */
export function DocumentGroup({
  group,
  label,
  documents,
}: DocumentGroupProps) {
  const { operation } = useSurveyProfile();
  const uploadDocuments = useUploadSurveyDocuments();
  const removeDocument = useDeleteSurveyDocument();
  const inputRef = useRef<HTMLInputElement>(null);
  const isBusy = operation !== "idle";

  /** Связывает просмотр файла с удалением по его исходному адресу. */
  function createGalleryItem(document: SurveyDocument): FileGalleryItem {
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
      SURVEY_DOCUMENT_LIMIT - documents.length,
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
        documents.length < SURVEY_DOCUMENT_LIMIT
          ? openFilePicker
          : undefined
      }
      input={
        <input
          ref={inputRef}
          type="file"
          hidden
          multiple
          accept={SURVEY_DOCUMENT_ACCEPT}
          disabled={isBusy}
          onChange={changeFiles}
        />
      }
    />
  );
}
