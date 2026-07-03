import { tapHaptic } from "@/shared/services/telegram";
import { FileTypeIcon } from "@/shared/ui/file-icon";
import { CloseIcon, PlusIcon, UploadIcon } from "@/shared/ui/icons/interface";
import { fileName } from "@/shared/lib/files";
import { formatSize } from "@/shared/lib/format";
import s from "./style.module.scss";

interface Props {
  files: File[];
  onAdd: (list: FileList | null) => void;
  onRemove: (index: number) => void;
  keptUrls?: string[];
  onRemoveKept?: (url: string) => void;
  note?: string;
}

export function FilePicker({ files, onAdd, onRemove, keptUrls = [], onRemoveKept, note }: Props) {
  return (
    <div className={s.wrap}>
      <div className={s.attach}>
        <span className={s.attachIcon}>
          <UploadIcon width={20} height={20} />
        </span>
        <span className={s.attachText}>Прикрепить файлы</span>
        <PlusIcon className={s.attachPlus} width={18} height={18} />
        <input
          type="file"
          multiple
          className={s.attachInput}
          onClick={() => tapHaptic()}
          onChange={(e) => {
            onAdd(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {note && <span className={s.note}>{note}</span>}

      {(keptUrls.length > 0 || files.length > 0) && (
        <ul className={s.fileList}>
          {keptUrls.map((url) => (
            <li key={url} className={s.fileItem}>
              <FileTypeIcon name={url} className={s.fileIcon} />
              <span className={s.fileName}>{fileName(url)}</span>
              <button
                type="button"
                className={s.fileRemove}
                onClick={() => {
                  tapHaptic();
                  onRemoveKept?.(url);
                }}
                aria-label="Удалить файл"
              >
                <CloseIcon width={16} height={16} />
              </button>
            </li>
          ))}
          {files.map((file, i) => (
            <li key={`new-${i}`} className={s.fileItem}>
              <FileTypeIcon name={file.name} className={s.fileIcon} />
              <div className={s.fileMeta}>
                <span className={s.fileName}>{file.name}</span>
                <span className={s.fileSize}>{formatSize(file.size)}</span>
              </div>
              <button
                type="button"
                className={s.fileRemove}
                onClick={() => {
                  tapHaptic();
                  onRemove(i);
                }}
                aria-label="Удалить файл"
              >
                <CloseIcon width={16} height={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
