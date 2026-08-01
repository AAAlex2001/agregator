"use client";

import { useRef } from "react";
import Button from "@/source/shared/ui/Button";
import s from "./DirectionDocumentsPicker.module.scss";

const ACCEPT =
  ".pdf,.jpg,.jpeg,.png,.doc,.docx,application/pdf,image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const MAX_FILES = 10;

interface Props {
  files: File[];
  onAdd: (files: File[]) => void;
  onRemove: (index: number) => void;
}

export function DirectionDocumentsPicker({ files, onAdd, onRemove }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={s.root}>
      <span className={s.label}>Дипломы, аттестаты, курсы</span>
      <span className={s.hint}>PDF / JPG / PNG / DOC / DOCX, до 10 МБ, не более {MAX_FILES} файлов</span>

      {files.length > 0 && (
        <ul className={s.list}>
          {files.map((file, index) => (
            <li key={`${file.name}-${index}`} className={s.item}>
              <span className={s.name}>{file.name}</span>
              <button
                type="button"
                className={s.remove}
                aria-label={`Убрать файл ${file.name}`}
                onClick={() => onRemove(index)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {files.length < MAX_FILES && (
        <Button
          type="button"
          variant="transparent"
          size="sm"
          className={s.add}
          onClick={() => inputRef.current?.click()}
        >
          + Добавить документ
        </Button>
      )}

      <input
        ref={inputRef}
        type="file"
        hidden
        multiple
        accept={ACCEPT}
        onChange={(event) => {
          const selected = Array.from(event.target.files ?? []);
          event.target.value = "";
          if (selected.length) onAdd(selected.slice(0, MAX_FILES - files.length));
        }}
      />
    </div>
  );
}
