"use client";

import { useRef } from "react";
import { FileGallery } from "@/source/shared/ui";
import {
  getFileGalleryPreviewUrl,
  getFileGalleryThumbUrl,
  isImageFileName,
} from "@/source/shared/lib/filePreview";
import { resolveFileUrl } from "@/source/shared/lib/fileUrl";
import type { DirectionDocument, DirectionKey } from "@/source/entities/direction";
import { useDirectionDocuments } from "../model/useDirectionDocuments";

const ACCEPT =
  ".pdf,.jpg,.jpeg,.png,.doc,.docx,application/pdf,image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const HINT = "PDF / JPG / PNG / DOC / DOCX, до 10 МБ, не более 10 файлов";

interface Props {
  directionKey: DirectionKey;
  documents: DirectionDocument[];
  onChange: (key: DirectionKey, documents: DirectionDocument[]) => void;
}

export function DirectionDocumentsField({ directionKey, documents, onChange }: Props) {
  const { isBusy, upload, remove } = useDirectionDocuments({ directionKey, documents, onChange });
  const inputRef = useRef<HTMLInputElement>(null);

  const items = documents.map((document) => {
    const resolved = resolveFileUrl(document.url);
    const isImage = isImageFileName(document.name);
    return {
      id: document.url,
      name: document.name,
      url: resolved,
      previewUrl: isImage ? resolved : getFileGalleryPreviewUrl(resolved, document.name),
      thumbnailUrl: getFileGalleryThumbUrl(resolved, document.name),
      isImage,
      onRemove: isBusy ? undefined : () => void remove(document.url),
    };
  });

  return (
    <FileGallery
      variant="editable"
      label="Дипломы, аттестаты, курсы"
      hint={HINT}
      emptyText="Документы не загружены"
      items={items}
      onAdd={() => inputRef.current?.click()}
      input={
        <input
          ref={inputRef}
          type="file"
          hidden
          accept={ACCEPT}
          disabled={isBusy}
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) void upload(file);
          }}
        />
      }
    />
  );
}
