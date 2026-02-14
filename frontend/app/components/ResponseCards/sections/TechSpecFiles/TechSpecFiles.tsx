"use client";

import styles from "./techSpecFiles.module.scss";

interface TechSpecFilesProps {
  techSpecTitle?: string;
  techSpecFiles?: string[];
}

const TechSpecFiles = ({ techSpecTitle, techSpecFiles }: TechSpecFilesProps) => {
  if (!techSpecTitle || !techSpecFiles || techSpecFiles.length === 0)
    return null;

  return (
    <div className={styles.filesRow}>
      <span className={styles.filesTitle}>{techSpecTitle}</span>
      <div className={styles.filesList}>
        {techSpecFiles.map((file, index) => (
          <a key={index} href="#" className={styles.fileLink}>
            {file}
          </a>
        ))}
      </div>
    </div>
  );
};

export default TechSpecFiles;
