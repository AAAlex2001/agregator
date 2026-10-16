"use client";

import { useRef } from "react";
import type { ChangeEvent } from "react";
import { getFileDisplayName, resolveFileUrl } from "@/shared/lib/file-url";
import type { LocalFile } from "@/shared/lib/local-file";
import { FileGallery } from "@/shared/ui/file-gallery";
import type { FileGalleryItem } from "@/shared/ui/file-gallery";
import { ORDER_DOCUMENT_ACCEPT } from "../../config/files";
import styles from "./style.module.scss";

/** Сохранённые и выбранные документы одной категории заказа. */
interface OrderDocumentSlotProps {
  label: string;
  existing: string[];
  files: LocalFile[];
  multiple: boolean;
  canAdd: boolean;
  onAdd: (files: File[]) => void;
  onRemoveExisting: (path: string) => void;
  onRemoveFile: (file: File) => void;
}

/** Показывает документы категории и позволяет выбрать или удалить вложение. */
export function OrderDocumentSlot({
  label,
  existing,
  files,
  multiple,
  canAdd,
  onAdd,
  onRemoveExisting,
  onRemoveFile,
}: OrderDocumentSlotProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const existingItems = existing.map(createExistingItem);
  const newItems = files.map(createSelectedItem);

  /** Подготавливает сохранённый документ, оставляя исходный путь для удаления. */
  function createExistingItem(path: string): FileGalleryItem {
    /** Исключает этот сохранённый документ из заказа. */
    function removeDocument() {
      onRemoveExisting(path);
    }

    return {
      id: path,
      name: getFileDisplayName(path),
      url: resolveFileUrl(path),
      onRemove: removeDocument,
    };
  }

  /** Подготавливает выбранный файл с адресом, принадлежащим форме. */
  function createSelectedItem(selected: LocalFile): FileGalleryItem {
    /** Убирает этот новый файл до сохранения заказа. */
    function removeSelectedFile() {
      onRemoveFile(selected.file);
    }

    return {
      id: selected.previewUrl,
      name: selected.file.name,
      url: selected.previewUrl,
      previewUrl: selected.previewUrl,
      thumbnailUrl: selected.previewUrl,
      onRemove: removeSelectedFile,
    };
  }

  /** Открывает системный выбор файлов этой категории. */
  function openFilePicker() {
    inputRef.current?.click();
  }

  /** Передаёт выбранные файлы и разрешает повторный выбор того же документа. */
  function changeFiles(event: ChangeEvent<HTMLInputElement>) {
    onAdd([...(event.target.files ?? [])]);
    event.target.value = "";
  }

  return (
    <FileGallery
      variant="editable"
      label={label}
      blockClassName={styles.slot}
      labelClassName={styles.caption}
      items={[...existingItems, ...newItems]}
      emptyText="—"
      onAdd={canAdd ? openFilePicker : undefined}
      input={
        <input
          ref={inputRef}
          type="file"
          hidden
          multiple={multiple}
          accept={ORDER_DOCUMENT_ACCEPT}
          onChange={changeFiles}
        />
      }
    />
  );
}
