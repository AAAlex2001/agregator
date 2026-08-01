"use client";

import { useRef } from "react";
import { FileGallery } from "@/source/shared/ui";
import { isImageFileName } from "@/source/shared/lib/filePreview";
import { useObjectUrls } from "@/source/shared/lib/useObjectUrls";

const ACCEPT =
  ".pdf,.jpg,.jpeg,.png,.doc,.docx,application/pdf,image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const HINT = "PDF / JPG / PNG / DOC / DOCX, до 10 МБ, не более 10 файлов";
const MAX_FILES = 10;

interface Props {
  files: File[] | undefined;
  onAdd: (files: File[]) => void;
  onRemove: (index: number) => void;
}

export function DirectionDocumentsPicker({ files, onAdd, onRemove }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const urls = useObjectUrls(files);
  const selected = files ?? [];

  const items =
    urls.length === selected.length
      ? selected.map((file, index) => ({
          id: `${file.name}-${index}`,
          name: file.name,
          url: urls[index],
          previewUrl: urls[index],
          thumbnailUrl: urls[index],
          isImage: isImageFileName(file.name),
          onRemove: () => onRemove(index),
        }))
      : [];

  return (
    <FileGallery
      variant="editable"
      label="Дипломы, аттестаты, курсы"
      hint={HINT}
      items={items}
      onAdd={selected.length < MAX_FILES ? () => inputRef.current?.click() : undefined}
      input={
        <input
          ref={inputRef}
          type="file"
          hidden
          multiple
          accept={ACCEPT}
          onChange={(event) => {
            const picked = Array.from(event.target.files ?? []);
            event.target.value = "";
            if (picked.length) onAdd(picked.slice(0, MAX_FILES - selected.length));
          }}
        />
      }
    />
  );
}
