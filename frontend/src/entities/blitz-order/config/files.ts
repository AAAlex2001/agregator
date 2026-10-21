/** Расширения файлов, которые принимает Блиц-эксперт. */
export const BLITZ_FILE_EXTENSIONS = [
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".jpg",
  ".jpeg",
  ".png",
  ".zip",
  ".rar",
];

/** Расширения для заключения: ещё файлы отсоединённой подписи. */
export const BLITZ_SIGNED_EXTENSIONS = [...BLITZ_FILE_EXTENSIONS, ".sig", ".p7s"];

/** Форматы для окна выбора файлов. */
export const BLITZ_FILE_ACCEPT = BLITZ_FILE_EXTENSIONS.join(",");

/** Форматы заключения для окна выбора файлов. */
export const BLITZ_SIGNED_ACCEPT = BLITZ_SIGNED_EXTENSIONS.join(",");

/** Сколько файлов можно приложить за раз. */
export const BLITZ_FILE_LIMIT = 20;

/** Наибольший размер одного файла: 50 МБ. */
export const BLITZ_FILE_MAX_SIZE = 50 * 1024 * 1024;

/** Подсказка об ограничениях файлов. */
export const BLITZ_FILES_HINT = "До 20 файлов по 50 МБ: PDF, Word, Excel, JPEG, PNG, ZIP, RAR";

/** Расширения файлов аудита: PDF, подпись, фото и видео — Word и Excel аудитор не принимает. */
export const BLITZ_AUDIT_EXTENSIONS = [
  ".pdf",
  ".sig",
  ".p7s",
  ".jpg",
  ".jpeg",
  ".png",
  ".heic",
  ".mp4",
  ".mov",
];

/** Форматы аудита для окна выбора файлов. */
export const BLITZ_AUDIT_ACCEPT = BLITZ_AUDIT_EXTENSIONS.join(",");

/** Наибольший размер одного файла аудита: 500 МБ. */
export const BLITZ_AUDIT_FILE_MAX_SIZE = 500 * 1024 * 1024;

/** Подсказка об ограничениях файлов аудита. */
export const BLITZ_AUDIT_FILES_HINT = "До 500 МБ: PDF, PDF с подписью, SIG, P7S, фото и видео";
