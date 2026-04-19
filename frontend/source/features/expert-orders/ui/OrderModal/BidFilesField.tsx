"use client";

import { useEffect, useRef, useState } from "react";
import s from "./orderFlow.module.scss";

interface Props {
  files: File[];
  onAddFiles: (files: FileList | null) => void;
  onRemoveFile: (index: number) => void;
}

interface PreviewItem {
  file: File;
  url: string;
}

function isImageFile(file: File) {
  return file.type.startsWith("image/") || /\.(jpe?g|png|gif|webp)$/i.test(file.name);
}

function shortName(name: string) {
  return name.length > 10 ? `${name.slice(0, 10)}…` : name;
}

export function BidFilesField({ files, onAddFiles, onRemoveFile }: Props) {
  const [previews, setPreviews] = useState<PreviewItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const nextPreviews = files
      .filter(isImageFile)
      .map((file) => ({ file, url: URL.createObjectURL(file) }));

    setPreviews(nextPreviews);

    return () => {
      nextPreviews.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [files]);

  return (
    <div className={s.fileField}>
      <div className={s.fieldHeader}>
        <span className={s.fieldLabel}>Ваши файлы</span>
        <span className={s.fieldHint}>Максимум 6 файлов и 100 МБ суммарно</span>
      </div>

      <div className={s.fileGrid}>
        <button
          type="button"
          className={s.fileAddButton}
          onClick={() => {
            if (!inputRef.current) return;
            inputRef.current.value = "";
            inputRef.current.click();
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 5V19M5 12H19" stroke="#FF8A00" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {files.map((file, index) => {
          const preview = previews.find((item) => item.file === file);

          return (
            <div key={`${file.name}-${index}`} className={s.fileTile}>
              {preview ? (
                <img src={preview.url} alt={file.name} className={s.fileImage} />
              ) : (
                <span className={s.fileTileName}>{shortName(file.name)}</span>
              )}

              <button type="button" className={s.fileRemoveButton} onClick={() => onRemoveFile(index)}>
                ×
              </button>
            </div>
          );
        })}
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.jpeg,.jpg,.png,.doc,.docx,.xls,.xlsx"
        className={s.hiddenInput}
        onChange={(event) => onAddFiles(event.currentTarget.files)}
      />
    </div>
  );
}