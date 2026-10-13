"use client";

import { useRef } from "react";
import { resolveFileUrl } from "@/source/shared/lib/fileUrl";
import { getFileDisplayName } from "@/source/shared/lib/filePreview";
import { localFileItem } from "@/source/shared/lib/localFile";
import { FileGallery } from "@/source/shared/ui/FileGallery";
import s from "./DocumentSlot.module.scss";

const ACCEPT = ".pdf,.jpeg,.jpg,.png,.doc,.docx,.xls,.xlsx,.zip,.rar,.7z";

interface DocumentSlotProps {
  label: string;
  existing: string[];
  files: File[];
  multiple: boolean;
  canAdd: boolean;
  onAdd: (files: File[]) => void;
  onRemoveExisting: (path: string) => void;
  onRemoveFile: (file: File) => void;
}

/** Одна категория документов заказа: уже загруженные файлы и новые, ещё не отправленные. */
export function DocumentSlot({ label, existing, files, multiple, canAdd, onAdd, onRemoveExisting, onRemoveFile }: DocumentSlotProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const existingItems = existing.map((path) => ({
    id: path,
    name: getFileDisplayName(path),
    url: resolveFileUrl(path),
    onRemove: () => onRemoveExisting(path),
  }));
  const newItems = files.map((file) => localFileItem(file, () => onRemoveFile(file)));

  return (
    <FileGallery
      variant="editable"
      label={label}
      blockClassName={s.slot}
      labelClassName={s.caption}
      items={[...existingItems, ...newItems]}
      emptyText="—"
      onAdd={canAdd ? () => inputRef.current?.click() : undefined}
      input={
        <input
          ref={inputRef}
          type="file"
          hidden
          multiple={multiple}
          accept={ACCEPT}
          onChange={(event) => {
            onAdd(Array.from(event.target.files ?? []));
            event.target.value = "";
          }}
        />
      }
    />
  );
}
