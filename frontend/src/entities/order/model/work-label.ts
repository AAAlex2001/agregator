import type { OrderListItem } from "./order-list-item";

/** Названия направлений в карточках, включая прежнее объединённое направление. */
const ORDER_WORK_LABELS = {
  EXPERTISE: "Экспертиза",
  AUDIT_SUPB: "Аудит СУПБ",
  TECH_DIAG: "Техдиагностирование",
  DESIGN: "Проектирование",
  ECOLOGY: "Экология",
  SURVEY: "Изыскания",
  RESEARCH: "НИРы",
  LABORATORY: "Лабораторные исследования",
  CADASTRAL: "Кадастровые работы",
  FORENSIC: "Судебная экспертиза",
  RESEARCH_LAB: "НИРы и лабораторные исследования",
};

/** Возвращает подпись направления заказа. */
export function getOrderWorkLabel(workType: OrderListItem["work_type"]): string {
  return ORDER_WORK_LABELS[workType];
}
