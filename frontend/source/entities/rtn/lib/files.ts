import { resolveFileUrl } from "@/source/shared/lib/fileUrl";
import type { FileGalleryItem } from "@/source/shared/ui/FileGallery";
import type { RtnFile, RtnListItem } from "../model/clarification";

/** Файл из API — в плитку галереи. */
export function toGalleryItem(file: RtnFile): FileGalleryItem {
  return { id: file.url, name: file.name, url: resolveFileUrl(file.url) };
}

/** Есть ли у разъяснения что показать в блоке «Документы». */
export function hasRtnDocuments(item: RtnListItem): boolean {
  return item.request_files.length > 0 || item.response_files.length > 0 || Boolean(item.source_url);
}
