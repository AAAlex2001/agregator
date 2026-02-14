import { ArrowIcon } from "@/app/icons";
import { Button } from "@/app/components";
import styles from "./technicalSection.module.scss";

interface TechnicalSectionProps {
  technicalFiles: string[];
  onRespond?: () => void;
  isResponding?: boolean;
}

const MAX_TECHNICAL_FILES = 4;

function getFileDisplayName(filePath: string): string {
  const fileName = filePath.split("/").pop() || filePath;
  return fileName.length > 12 ? `${fileName.slice(0, 12)}…` : fileName;
}

export default function TechnicalSection({ technicalFiles, onRespond, isResponding = false }: TechnicalSectionProps) {
  const filesToShow = technicalFiles.slice(0, MAX_TECHNICAL_FILES);

  return (
    <div className={styles.technicalSection}>
      <div className={styles.technicalFiles}>
        <div className={styles.technicalTitle}>Файлы технического задания</div>
        <div className={styles.filesRow}>
          {filesToShow.map((filePath, index) => (
            <a
              key={`${filePath}-${index}`}
              href={filePath}
              className={styles.fileItem}
              target="_blank"
              rel="noreferrer"
            >
              {getFileDisplayName(filePath)}
            </a>
          ))}
          {Array.from({ length: Math.max(0, MAX_TECHNICAL_FILES - filesToShow.length) }).map((_, index) => (
            <div key={`placeholder-${index}`} className={`${styles.fileItem} ${styles.filePlaceholder}`} />
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
    </div>
  );
}
