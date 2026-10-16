import type { OrderDirection } from "./order-direction";
import type { OrderBadge } from "./types";

/** Отображаемые сведения карточки опубликованного заказа или его предпросмотра. */
export interface OrderCardData {
  id: number;
  title: string;
  company: string;
  customer_name: string;
  customer_inn: string;
  start_date: string;
  date: string;
  sum: string;
  responses_deadline: string | null;
  created_at_display: string;
  status: "ACTIVE" | "ARCHIVED";
  work_type: OrderDirection["work_type"];
  badges: OrderBadge[];
  previous_title: string | null;
  previous_sum: string | null;
  previous_date: string | null;
  previous_badges: OrderBadge[] | null;
}
