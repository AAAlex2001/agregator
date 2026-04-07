import styles from "./file-pending.module.scss";

interface FilePendingProps {
  file: File;
  onRemove: () => void;
}

export function FilePending({ file, onRemove }: FilePendingProps) {
  return (
    <div className={styles.filePending}>
      <span className={styles.name}>📎 {file.name}</span>
      <button type="button" className={styles.remove} onClick={onRemove}>
        ×
      </button>
    </div>
  );
}

export function UploadProgress({ percent }: { percent: number }) {
  return (
    <div className={styles.progress}>
      <div className={styles.progressBar} style={{ width: `${percent}%` }} />
      <span className={styles.progressText}>{percent}%</span>
    </div>
  );
}
