export const MAX_POST_MEDIA = 10;
export const MEDIA_ACCEPT = "image/jpeg,image/png,image/webp,video/mp4,video/quicktime,.jpg,.jpeg,.png,.webp,.mp4,.mov";

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const MEDIA_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "mp4", "mov"];

/** Почему файл нельзя загрузить, или пустая строка. Окончательно формат проверяет сервер. */
export function mediaProblem(file: File): string {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!MEDIA_EXTENSIONS.includes(extension)) return "Подойдут фото JPEG, PNG, WebP и видео MP4, MOV";
  if (file.size === 0) return "Файл пустой";
  if (file.size > MAX_FILE_SIZE) return "Размер одного файла — не больше 50 МБ";
  return "";
}
