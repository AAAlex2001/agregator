/** Расширения файлов, которые принимает поддержка. */
export const TICKET_FILE_EXTENSIONS = [
  ".pdf",
  ".jpeg",
  ".jpg",
  ".png",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
];

/** Форматы для системного окна выбора файлов. */
export const TICKET_FILE_ACCEPT = TICKET_FILE_EXTENSIONS.join(",");

/** Сколько файлов можно приложить к одному сообщению. */
export const TICKET_FILE_LIMIT = 6;

/** Наибольший размер одного файла: 100 МБ. */
export const TICKET_FILE_MAX_SIZE = 100 * 1024 * 1024;

/** Подсказка об ограничениях вложений. */
export const TICKET_FILES_HINT =
  `До ${TICKET_FILE_LIMIT} файлов: PDF, JPEG, PNG, DOC, DOCX, XLS, XLSX`;
