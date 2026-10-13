"use client";

import { useRef } from "react";
import { FileGallery, type FileGalleryItem } from "@/source/shared/ui/FileGallery";
import s from "./BidFilesField.module.scss";

const ACCEPT = ".pdf,.jpeg,.jpg,.png,.doc,.docx,.xls,.xlsx";

interface BidFilesFieldProps {
  items: FileGalleryItem[];
  onAdd: (files: FileList | null) => void;
}

/** Плитки файлов отклика с кнопкой «добавить». */
export function BidFilesField({ items, onAdd }: BidFilesFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <FileGallery
      variant="editable"
      label="Ваши файлы"
      labelClassName={s.label}
      hint="Максимум 6 файлов и 100 МБ суммарно"
      hintClassName={s.hint}
      items={items}
      onAdd={() => inputRef.current?.click()}
      input={
        <input
          ref={inputRef}
          type="file"
          hidden
          multiple
          accept={ACCEPT}
          onChange={(event) => {
            onAdd(event.target.files);
            event.target.value = "";
          }}
        />
      }
    />
  );
}
