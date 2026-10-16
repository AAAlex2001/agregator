import { DOCUMENT_THUMBNAIL } from "../config/document-thumbnail";

/** Определяет изображения, которые галерея может показать без iframe. */
export function isImageFileName(name: string): boolean {
  return /\.(jpe?g|png|gif|webp)$/i.test(name);
}

/** Возвращает подпись формата файла для плитки документа. */
export function getFileExtension(name: string): string {
  const extension = /\.([a-z0-9]+)$/i.exec(name);

  return (extension?.[1] ?? "file").toUpperCase();
}

/** Открывает публичные офисные документы через просмотрщик Microsoft. */
export function getFilePreviewUrl(url: string, name: string): string {
  const isOfficeDocument = /\.(docx?|xlsx?)$/i.test(name);
  const isPublicUrl =
    /^https?:\/\//i.test(url) &&
    !/^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/i.test(url);

  if (isOfficeDocument && isPublicUrl) {
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
  }

  return url;
}

/** Для документов использует общую иллюстрацию, для изображений — сам файл. */
export function getFileThumbnailUrl(url: string, name: string): string {
  return isImageFileName(name) ? url : DOCUMENT_THUMBNAIL;
}
