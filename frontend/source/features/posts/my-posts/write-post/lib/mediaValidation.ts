export const MAX_POST_MEDIA = 10;
const MAX_FILE_SIZE = 50 * 1024 * 1024;
const MEDIA_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/quicktime",
];
const MEDIA_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "mp4", "mov"];

/** Проверяет формат и размер файла до загрузки. */
export function validatePostMedia(file: File): string | null {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (
    !MEDIA_TYPES.includes(file.type) &&
    !(file.type === "" && MEDIA_EXTENSIONS.includes(extension))
  ) {
    return "Подойдут фото JPEG, PNG, WebP и видео MP4, MOV";
  }
  if (file.size > MAX_FILE_SIZE) return "Размер одного файла — не больше 50 МБ";
  if (file.size === 0) return "Файл пустой";
  return null;
}
