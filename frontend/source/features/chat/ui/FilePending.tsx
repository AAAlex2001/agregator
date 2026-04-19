import s from "./FilePending.module.scss";

interface FilePendingProps {
  file: File;
  onRemove: () => void;
}

export function FilePending({ file, onRemove }: FilePendingProps) {
  return (
    <div className={s.filePending}>
      <span className={s.name}>📎 {file.name}</span>
      <button type="button" className={s.remove} onClick={onRemove}>
        ×
      </button>
    </div>
  );
}

export function UploadProgress({ percent }: { percent: number }) {
  return (
    <div className={s.progress}>
      <div className={s.progressBar} style={{ width: `${percent}%` }} />
      <span className={s.progressText}>{percent}%</span>
    </div>
  );
}