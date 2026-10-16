/** Форматы выбора документов; сервер дополнительно проверяет MIME и размер до 10 МБ. */
export const ECOLOGY_DOCUMENT_ACCEPT = ".pdf,.jpg,.jpeg,.png,.doc,.docx,"
  + "application/pdf,image/jpeg,image/png,application/msword,"
  + "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

/** Предел документов анкеты из API ecology и прежнего SavedDocumentsField. */
export const ECOLOGY_DOCUMENT_LIMIT = 10;
