"use client";

import { useRef } from "react";
import { FileGallery } from "@/source/shared/ui/FileGallery";
import { FILE_ACCEPT, FILE_HINT, MAX_PROFILE_DOCUMENTS, type DirectionFile } from "../model/files";
import { toGalleryItem } from "../model/galleryItem";

interface SavedDocumentsFieldProps {
  label: string;
  documents: DirectionFile[];
  isBusy: boolean;
  onUpload: (files: File[]) => void;
  onRemove: (url: string) => void;
  maxFiles?: number;
}

/** Список документов на сервере: добавление нескольких файлов сразу и удаление по одному. */
export function SavedDocumentsField({
  label,
  documents,
  isBusy,
  onUpload,
  onRemove,
  maxFiles = MAX_PROFILE_DOCUMENTS,
}: SavedDocumentsFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const items = documents.map((document) =>
    toGalleryItem(document, isBusy ? undefined : () => onRemove(document.url)),
  );

  return (
    <FileGallery
      variant="editable"
      label={label}
      hint={`${FILE_HINT}, не более ${maxFiles} файлов`}
      emptyText="Документы не загружены"
      items={items}
      onAdd={documents.length < maxFiles ? () => inputRef.current?.click() : undefined}
      input={
        <input
          ref={inputRef}
          type="file"
          hidden
          multiple
          accept={FILE_ACCEPT}
          disabled={isBusy}
          onChange={(event) => {
            const files = Array.from(event.target.files ?? []).slice(0, maxFiles - documents.length);
            event.target.value = "";
            if (files.length) onUpload(files);
          }}
        />
      }
    />
  );
}
