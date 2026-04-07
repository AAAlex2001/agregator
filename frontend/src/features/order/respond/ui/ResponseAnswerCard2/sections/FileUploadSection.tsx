"use client";

import { useEffect, useState } from "react";
import { Button } from "@/shared/ui";
import {
  isImageFilePath,
  resolveFileUrl,
} from "@/shared/lib/fileAttachments";
import styles from "./sections.module.scss";

const IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];

function isImageFile(file: File): boolean {
  return IMAGE_TYPES.includes(file.type);
}

function getExistingFileName(filePath: string): string {
  const name = filePath.split("/").pop() || filePath;
  return name.length > 8 ? `${name.slice(0, 8)}…` : name;
}

const FileIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5 20V4C5 3.73478 5.10536 3.48043 5.29289 3.29289C5.48043 3.10536 5.73478 3 6 3H12.172C12.7024 3.00011 13.211 3.2109 13.586 3.586L18.414 8.414C18.7891 8.78899 18.9999 9.29761 19 9.828V20C19 20.2652 18.8946 20.5196 18.7071 20.7071C18.5196 20.8946 18.2652 21 18 21H6C5.73478 21 5.48043 20.8946 5.29289 20.7071C5.10536 20.5196 5 20.2652 5 20Z"
      stroke="#CED2D6"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M12 3V9C12 9.26522 12.1054 9.51957 12.2929 9.70711C12.4804 9.89464 12.7348 10 13 10H19"
      stroke="#CED2D6"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

interface FileUploadSectionProps {
  files: File[];
  existingFiles?: string[];
  onAddFile: () => void;
  onRemoveFile: (index: number) => void;
  onRemoveExistingFile?: (index: number) => void;
  canSubmit: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
  submitLabel?: string;
}

export default function FileUploadSection({
  files,
  existingFiles = [],
  onAddFile,
  onRemoveFile,
  onRemoveExistingFile,
  canSubmit,
  isSubmitting,
  onSubmit,
  submitLabel,
}: FileUploadSectionProps) {
  const [previews, setPreviews] = useState<Map<number, string>>(new Map());

  useEffect(() => {
    const newPreviews = new Map<number, string>();
    const urls: string[] = [];

    files.forEach((file, index) => {
      if (isImageFile(file)) {
        const url = URL.createObjectURL(file);
        newPreviews.set(index, url);
        urls.push(url);
      }
    });

    setPreviews(newPreviews);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  return (
    <div className={styles.fileSection}>
      <div className={styles.fileContent}>
        <span className={styles.fileTitle}>Ваши файлы</span>
        <div className={styles.fileThumbnails}>
          {existingFiles.map((filePath, index) => (
            <div key={`existing-${filePath}-${index}`} className={styles.fileThumbnail}>
              {isImageFilePath(filePath) ? (
                <img
                  src={resolveFileUrl(filePath)}
                  alt={getExistingFileName(filePath)}
                  className={styles.filePreviewImage}
                />
              ) : (
                <>
                  <FileIcon />
                  <span className={styles.fileName}>
                    {getExistingFileName(filePath)}
                  </span>
                </>
              )}
              <button
                type="button"
                className={styles.fileRemove}
                onClick={() => onRemoveExistingFile?.(index)}
              >
                ×
              </button>
            </div>
          ))}
          {files.map((file, index) => (
            <div key={`${file.name}-${index}`} className={styles.fileThumbnail}>
              {previews.has(index) ? (
                <img
                  src={previews.get(index)}
                  alt={file.name}
                  className={styles.filePreviewImage}
                />
              ) : (
                <>
                  <FileIcon />
                  <span className={styles.fileName}>
                    {file.name.length > 8 ? `${file.name.slice(0, 8)}…` : file.name}
                  </span>
                </>
              )}
              <button
                type="button"
                className={styles.fileRemove}
                onClick={() => onRemoveFile(index)}
              >
                ×
              </button>
            </div>
          ))}
          <button type="button" className={styles.fileAdd} onClick={onAddFile}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="#FF8A00" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
      <Button
        variant="primary"
        size="sm"
        fullWidth
        className={styles.submitButton}
        disabled={!canSubmit}
        isLoading={isSubmitting}
        onClick={onSubmit}
      >
        {submitLabel ?? "Подать заявку"}
      </Button>
    </div>
  );
}
