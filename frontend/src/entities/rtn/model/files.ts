import { resolveFileUrl } from "@/shared/lib/file-url";
import type { FileGalleryItem } from "@/shared/ui/file-gallery";
import type { RtnFile, RtnListItem } from "./types";

/** Готовит документ РТН для просмотра и скачивания в общей галерее. */
export function toRtnGalleryItem(file: RtnFile): FileGalleryItem {
  return {
    id: file.url,
    name: file.name,
    url: resolveFileUrl(file.url),
  };
}

/** Проверяет, нужны ли карточке документы или ссылка на официальный источник. */
export function hasRtnDocuments(item: RtnListItem): boolean {
  return item.request_files.length > 0
    || item.response_files.length > 0
    || Boolean(item.source_url);
}
