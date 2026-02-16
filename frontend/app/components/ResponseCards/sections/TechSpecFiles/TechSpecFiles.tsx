"use client";

import { useState } from "react";
import {
  downloadFileByPath,
  getFileNameFromPath,
  isImageFilePath,
  resolveFileUrl,
} from "@/app/utils/fileAttachments";
import styles from "./techSpecFiles.module.scss";

interface TechSpecFilesProps {
  techSpecTitle?: string;
  techSpecFiles?: string[];
}

const TechSpecFiles = ({ techSpecTitle, techSpecFiles }: TechSpecFilesProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!techSpecTitle || !techSpecFiles || techSpecFiles.length === 0)
    return null;

  const handleFileClick = async (filePath: string) => {
    if (isImageFilePath(filePath)) {
      setSelectedImage(filePath);
      return;
    }

    await downloadFileByPath(filePath);
  };

  return (
    <>
      <div className={styles.filesRow}>
        <span className={styles.filesTitle}>{techSpecTitle}</span>
        <div className={styles.filesList}>
          {techSpecFiles.map((file, index) => (
            <button
              key={index}
              type="button"
              className={styles.fileLink}
              onClick={() => void handleFileClick(file)}
            >
              {getFileNameFromPath(file)}
            </button>
          ))}
        </div>
      </div>
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
    </>
  );
};

export default TechSpecFiles;
