import { getFileDisplayName, resolveFileUrl } from "@/shared/lib/file-url";
import { FileGallery } from "@/shared/ui/file-gallery";
import type { FileGalleryItem } from "@/shared/ui/file-gallery";

/** Сохранённые файлы отклика и необязательная подпись над ними. */
interface ResponseFilesProps {
  files: string[];
  title?: string;
}

/** Подготавливает загруженный файл к просмотру в галерее. */
function createGalleryItem(path: string, index: number): FileGalleryItem {
  return {
    id: `${path}-${index}`,
    name: getFileDisplayName(path, `Файл ${index + 1}`),
    url: resolveFileUrl(path),
  };
}

/** Показывает документы отклика с просмотром и скачиванием. */
export function ResponseFiles({ files, title }: ResponseFilesProps) {
  return (
    <FileGallery
      items={files.map(createGalleryItem)}
      label={title}
      hideWhenEmpty
    />
  );
}
