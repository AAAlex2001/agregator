"use client";

import { useRef } from "react";
import { FileGallery } from "@/source/shared/ui/FileGallery";
import { toGalleryItem } from "../lib/files";
import { RTN_ATTACHMENT_ACCEPT } from "../model/constants";
import type { RtnAttachments } from "../model/useRtnAttachments";

interface RtnAttachmentsFieldProps {
  label: string;
  attachments: RtnAttachments;
}

/** Плитки загруженных файлов с кнопкой «добавить» и удалением. */
export function RtnAttachmentsField({ label, attachments }: RtnAttachmentsFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const items = attachments.files.map((file) => ({ ...toGalleryItem(file), onRemove: () => attachments.remove(file.url) }));

  return (
    <FileGallery
      variant="editable"
      label={label}
      hint={attachments.isUploading ? "Загружаем файл…" : "PDF или изображение"}
      items={items}
      onAdd={() => inputRef.current?.click()}
      input={
        <input
          ref={inputRef}
          type="file"
          hidden
          accept={RTN_ATTACHMENT_ACCEPT}
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) void attachments.add(file);
          }}
        />
      }
    />
  );
}
