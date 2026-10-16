import type { OrderBadge } from "./types";

/** Основные условия заказа в сворачиваемой шапке формы отклика. */
export interface OrderSummary {
  title: string;
  company: string;
  customer_name: string;
  customer_inn: string;
  start_date: string;
  date: string;
  sum: string;
  badges: OrderBadge[];
}
