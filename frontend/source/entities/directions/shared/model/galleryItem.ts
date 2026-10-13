import type { FileGalleryItem } from "@/source/shared/ui/FileGallery";
import { getFileGalleryPreviewUrl, getFileGalleryThumbUrl, isImageFileName } from "@/source/shared/lib/filePreview";
import { resolveFileUrl } from "@/source/shared/lib/fileUrl";
import type { DirectionFile } from "./files";

/** Загруженный на сервер файл в виде карточки галереи: превью для картинок и PDF, иконка для остального. */
export function toGalleryItem(file: DirectionFile, onRemove?: () => void): FileGalleryItem {
  const url = resolveFileUrl(file.url);
  const isImage = isImageFileName(file.name);

  return {
    id: file.url,
    name: file.name,
    url,
    previewUrl: isImage ? url : getFileGalleryPreviewUrl(url, file.name),
    thumbnailUrl: getFileGalleryThumbUrl(url, file.name),
    isImage,
    onRemove,
  };
}
