/** Форматы СТО и свидетельства ОПО, которые принимает сервер для заказа. */
export const AUDIT_ORDER_DOCUMENT_ACCEPT = ".pdf,.jpg,.jpeg,.png,.doc,.docx,"
  + "application/pdf,image/jpeg,image/png,application/msword,"
  + "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

/** Подсказка об ограничениях документа и замене прежнего вложения. */
export const AUDIT_ORDER_DOCUMENT_HINT =
  "PDF / JPG / PNG / DOC / DOCX, до 10 МБ; новый файл заменит прежний";
