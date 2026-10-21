/** Шаг заявки на аудит. */
export type AuditStep =
  | "applicant"
  | "objects"
  | "params"
  | "terms"
  | "documents"
  | "customer"
  | "comment";

/** Шаги заявки по порядку и их названия. */
export const AUDIT_STEPS: { key: AuditStep; title: string }[] = [
  { key: "applicant", title: "Заявитель" },
  { key: "objects", title: "Объекты аудита" },
  { key: "params", title: "Параметры аудита" },
  { key: "terms", title: "Сроки и стоимость" },
  { key: "documents", title: "Документы" },
  { key: "customer", title: "Реквизиты заказчика" },
  { key: "comment", title: "Комментарий" },
];