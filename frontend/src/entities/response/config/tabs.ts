import type { ResponseTab } from "../model/types";

/** Вкладка списка откликов и её подпись. */
interface ResponseTabOption {
  id: ResponseTab;
  label: string;
}

/** Вкладки исполнителя, включая отозванные им отклики. */
export const EXPERT_RESPONSE_TABS: ResponseTabOption[] = [
  {
    id: "all",
    label: "Все",
  },
  {
    id: "review",
    label: "На рассмотрении",
  },
  {
    id: "in_progress",
    label: "В работе",
  },
  {
    id: "rejected",
    label: "Отклоненные",
  },
  {
    id: "accepted",
    label: "В переговорах",
  },
  {
    id: "withdrawn_by_expert",
    label: "Отозванные мной",
  },
];

/** Вкладки заказчика с откликами на его заказы. */
export const CUSTOMER_RESPONSE_TABS: ResponseTabOption[] = [
  {
    id: "all",
    label: "Все",
  },
  {
    id: "review",
    label: "Новые",
  },
  {
    id: "in_progress",
    label: "В работе",
  },
  {
    id: "rejected",
    label: "Отклоненные",
  },
  {
    id: "accepted",
    label: "В переговорах",
  },
];
