import { getFileDisplayName, resolveFileUrl } from "@/shared/lib/file-url";
import { FileGallery } from "@/shared/ui/file-gallery";
import type { FileGalleryItem } from "@/shared/ui/file-gallery";
import styles from "./style.module.scss";

/** Сохранённые файлы отклика и предыдущий список для сравнения. */
interface ResponseFilesProps {
  title: string;
  files: string[];
  previousFiles?: string[] | null;
}

/** Подготавливает загруженный файл к просмотру в галерее. */
function createGalleryItem(path: string, index: number): FileGalleryItem {
  return {
    id: `${path}-${index}`,
    name: getFileDisplayName(path, `Файл ${index + 1}`),
    url: resolveFileUrl(path),
  };
}

/** Показывает документы отклика и отмечает изменение их состава или порядка. */
export function ResponseFiles({
  title,
  files,
  previousFiles,
}: ResponseFilesProps) {
  const hasChanges = previousFiles != null && (
    previousFiles.length !== files.length
    || previousFiles.some((file, index) => file !== files[index])
  );
  const label = hasChanges
    ? `${title.replace(/[:\s]+$/, "")} · ИЗМЕНЕНЫ:`
    : title;

  return (
    <div className={hasChanges ? styles.wrapChanged : undefined}>
      <FileGallery
        items={files.map(createGalleryItem)}
        label={label}
        hideWhenEmpty
      />
    </div>
  );
}
