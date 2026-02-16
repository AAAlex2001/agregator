"use client";

import { useState } from "react";
import { ArrowIcon } from "@/app/icons";
import { Button } from "@/app/components";
import {
  downloadFileByPath,
  getFileNameFromPath,
  isImageFilePath,
  resolveFileUrl,
} from "@/app/utils/fileAttachments";
import styles from "./technicalSection.module.scss";

interface TechnicalSectionProps {
  technicalFiles: string[];
  onRespond?: () => void;
  isResponding?: boolean;
}

function getFileDisplayName(filePath: string): string {
  const fileName = filePath.split("/").pop() || filePath;
  return fileName.length > 12 ? `${fileName.slice(0, 12)}…` : fileName;
}

export default function TechnicalSection({ technicalFiles, onRespond, isResponding = false }: TechnicalSectionProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleFileClick = async (filePath: string) => {
    if (isImageFilePath(filePath)) {
      setSelectedImage(filePath);
      return;
    }

    await downloadFileByPath(filePath);
  };

  return (
    <div className={styles.technicalSection}>
      <div className={styles.technicalFiles}>
        <div className={styles.technicalTitle}>Файлы технического задания</div>
        <div className={styles.filesRow}>
          {technicalFiles.map((filePath, index) => (
            <button
              key={`${filePath}-${index}`}
              type="button"
              className={styles.fileItem}
              onClick={() => void handleFileClick(filePath)}
            >
              {getFileDisplayName(filePath)}
            </button>
          ))}
        </div>
      </div>

      <Button
        type="button"
        variant="primary"
        size="md"
        className={styles.actionButton}
        onClick={onRespond}
        isLoading={isResponding}
      >
        <span className={styles.actionText}>Откликнуться</span>
        <ArrowIcon className={styles.actionArrow} color="#FFFFFF" />
      </Button>

      {selectedImage && (
        <div className={styles.previewOverlay} onClick={() => setSelectedImage(null)}>
          <div className={styles.previewModal} onClick={(event) => event.stopPropagation()}>
            <button type="button" className={styles.previewClose} onClick={() => setSelectedImage(null)}>
              ×
            </button>
            <img
              src={resolveFileUrl(selectedImage)}
              alt={getFileNameFromPath(selectedImage)}
              className={styles.previewImage}
            />
          </div>
        </div>
      )}
    </div>
  );
}
