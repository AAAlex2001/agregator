export const FILE_ACCEPT_EXT = [
  ".pdf",
  ".jpeg",
  ".jpg",
  ".png",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
] as const;

export const FILE_ACCEPT = FILE_ACCEPT_EXT.join(",");

export const MAX_FILES = 6;
export const MAX_FILE_SIZE = 100 * 1024 * 1024;
export const MAX_SUBJECT_LENGTH = 200;
export const MAX_MESSAGE_LENGTH = 5000;

export function ticketFilesError(current: File[], next: File[]): string | null {
  if (current.length + next.length > MAX_FILES) {
    return `Можно прикрепить не больше ${MAX_FILES} файлов`;
  }
  for (const file of next) {
    if (file.size > MAX_FILE_SIZE) {
      return `Файл больше ${Math.round(MAX_FILE_SIZE / 1024 / 1024)} МБ не поддерживается`;
    }
    if (!FILE_ACCEPT_EXT.some((ext) => file.name.toLowerCase().endsWith(ext))) {
      return "Поддерживаются: PDF, JPEG, PNG, DOC, DOCX, XLS, XLSX";
    }
  }
  return null;
}
