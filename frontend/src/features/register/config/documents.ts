/** Форматы документов регистрации, которые принимает API. */
export const DOCUMENT_ACCEPT = [
  ".pdf,.jpg,.jpeg,.png,.doc,.docx",
  "application/pdf,image/jpeg,image/png,application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
].join(",");

/** Подсказка об ограничениях документов регистрации. */
export const DOCUMENT_HINT = "PDF / JPG / PNG / DOC / DOCX, до 10 МБ";
