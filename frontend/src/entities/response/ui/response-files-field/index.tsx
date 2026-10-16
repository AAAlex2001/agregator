"use client";

import { useRef } from "react";
import type { ChangeEvent } from "react";
import { FileGallery } from "@/shared/ui/file-gallery";
import type { FileGalleryItem } from "@/shared/ui/file-gallery";
import { RESPONSE_FILES_ACCEPT } from "../../config/files";
import styles from "./style.module.scss";

/** Вложения предложения и обработчик выбора новых файлов. */
interface ResponseFilesFieldProps {
  items: FileGalleryItem[];
  onAdd: (files: FileList | null) => void;
}

/** Показывает файлы отклика и открывает выбор дополнительных вложений. */
export function ResponseFilesField({ items, onAdd }: ResponseFilesFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  /** Открывает системный диалог выбора файлов. */
  function openFilePicker() {
    inputRef.current?.click();
  }

  /** Передаёт выбранные файлы и позволяет повторно выбрать удалённый файл. */
  function changeFiles(event: ChangeEvent<HTMLInputElement>) {
    onAdd(event.target.files);
    event.target.value = "";
  }

  return (
    <FileGallery
      variant="editable"
      label="Ваши файлы"
      labelClassName={styles.label}
      hint="Максимум 6 файлов и 100 МБ суммарно"
      hintClassName={styles.hint}
      items={items}
      onAdd={openFilePicker}
      input={
        <input
          ref={inputRef}
          type="file"
          hidden
          multiple
          accept={RESPONSE_FILES_ACCEPT}
          onChange={changeFiles}
        />
      }
    />
  );
}
