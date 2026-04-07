import type { ResponseTabKey } from "./types";

export const EXPERT_TAB_META: Array<{ key: ResponseTabKey; label: string }> = [
  { key: "review", label: "На рассмотрении" },
  { key: "in_progress", label: "В работе" },
  { key: "rejected", label: "Отклоненные" },
  { key: "accepted", label: "В переговорах" },
  { key: "completed", label: "Завершены" },
];

export const CUSTOMER_TAB_META: Array<{ key: ResponseTabKey; label: string }> = [
  { key: "review", label: "Новые" },
  { key: "in_progress", label: "В работе" },
  { key: "rejected", label: "Отклоненные" },
  { key: "accepted", label: "В переговорах" },
  { key: "completed", label: "Завершены" },
];
