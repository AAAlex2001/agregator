import {
  TICKET_FILE_EXTENSIONS,
  TICKET_FILE_LIMIT,
  TICKET_FILE_MAX_SIZE,
} from "../config/files";

/** Проверяет, что поддержка принимает формат файла. */
function hasTicketFileExtension(file: File): boolean {
  const name = file.name.toLowerCase();

  return TICKET_FILE_EXTENSIONS.some((extension) => name.endsWith(extension));
}

/** Возвращает причину, по которой файлы нельзя приложить, или null. */
export function getTicketFilesError(currentCount: number, files: File[]): string | null {
  if (currentCount + files.length > TICKET_FILE_LIMIT) {
    return `Можно прикрепить не больше ${TICKET_FILE_LIMIT} файлов`;
  }

  if (files.some((file) => file.size > TICKET_FILE_MAX_SIZE)) {
    return "Файл больше 100 МБ не поддерживается";
  }

  if (!files.every(hasTicketFileExtension)) {
    return "Поддерживаются: PDF, JPEG, PNG, DOC, DOCX, XLS, XLSX";
  }

  return null;
}
