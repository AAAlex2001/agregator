"use client";

import { useRef } from "react";
import type { ChangeEvent } from "react";
import { FileGallery } from "@/shared/ui/file-gallery";
import type { FileGalleryItem } from "@/shared/ui/file-gallery";
import { toRtnGalleryItem } from "../../model/files";
import type { RtnAttachments, RtnFile } from "../../model/types";

/** Подпись и список вложений, выбранных для комментария или ответа. */
interface RtnAttachmentsFieldProps {
  label: string;
  attachments: RtnAttachments;
}

/** Показывает вложения с выбором PDF или изображения и удалением из списка. */
export function RtnAttachmentsField({
  label,
  attachments,
}: RtnAttachmentsFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const items = attachments.files.map(createGalleryItem);

  /** Добавляет к плитке действие удаления именно этого вложения. */
  function createGalleryItem(file: RtnFile): FileGalleryItem {
    /** Исключает выбранный документ из списка вложений. */
    function removeAttachment() {
      attachments.remove(file.url);
    }

    return {
      ...toRtnGalleryItem(file),
      onRemove: removeAttachment,
    };
  }

  /** Открывает выбор одного вложения. */
  function openFilePicker() {
    inputRef.current?.click();
  }

  /** Отправляет выбранный файл и разрешает повторно выбрать тот же документ. */
  function selectFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (file) {
      void attachments.add(file);
    }
  }

  return (
    <FileGallery
      variant="editable"
      label={label}
      hint={attachments.isUploading ? "Загружаем файл…" : "PDF или изображение"}
      items={items}
      onAdd={openFilePicker}
      input={
        <input
          ref={inputRef}
          type="file"
          hidden
          accept="image/png,image/jpeg,image/webp,application/pdf"
          onChange={selectFile}
        />
      }
    />
  );
}
