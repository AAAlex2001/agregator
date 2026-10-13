import type { FileGalleryItem } from "@/source/shared/ui/FileGallery";
import { isImageFileName } from "./filePreview";

const urls = new WeakMap<File, string>();

/** Ссылка на выбранный, но ещё не загруженный файл. Для одного файла всегда одна и та же. */
export function localFileUrl(file: File): string {
  const known = urls.get(file);
  if (known) return known;
  const url = URL.createObjectURL(file);
  urls.set(file, url);
  return url;
}

/** Выбранный файл плиткой галереи с превью и кнопкой удаления. */
export function localFileItem(file: File, onRemove: () => void): FileGalleryItem {
  const url = localFileUrl(file);
  return { id: url, name: file.name, url, previewUrl: url, thumbnailUrl: url, isImage: isImageFileName(file.name), onRemove };
}
