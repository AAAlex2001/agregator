/** Шаг заявки на экспертизу. */
export type OrderStep = "subject" | "price" | "documents" | "customer" | "comment";

/** Шаги заявки по порядку и их названия. */
export const ORDER_STEPS: { key: OrderStep; title: string }[] = [
  { key: "subject", title: "Что проверить" },
  { key: "price", title: "Цена" },
  { key: "documents", title: "Документация" },
  { key: "customer", title: "Заказчик" },
  { key: "comment", title: "Комментарий" },
];