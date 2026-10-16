/** Форматы основного файла лицензии, доступные в системном выборе файла. */
export const LICENSE_ACCEPT = ".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png";

/** Форматы дополнительных разрешительных документов. */
export const DOCUMENT_ACCEPT = [
  ".pdf,.jpg,.jpeg,.png,.doc,.docx",
  "application/pdf,image/jpeg,image/png,application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
].join(",");

/** Подсказка об ограничениях основного файла лицензии. */
export const LICENSE_HINT = "PDF / JPG / PNG, до 5 МБ";

/** Подсказка об ограничениях дополнительных разрешительных документов. */
export const DOCUMENT_HINT = "PDF / JPG / PNG / DOC / DOCX, до 10 МБ";

/** Сообщение после успешной замены каждого документа держателя лицензии. */
export const DOCUMENT_SUCCESS_MESSAGES = {
  license: "Файл лицензии обновлён",
  companyCard: "Карточка предприятия обновлена",
  miningLicense: "Файл лицензии маркшейдера обновлён",
  sroDesign: "Выписка из реестра СРО проектировщиков обновлена",
  sroSurvey: "Выписка из реестра СРО изыскателей обновлена",
  labAccreditation: "Файл аккредитации лаборатории обновлён",
};
