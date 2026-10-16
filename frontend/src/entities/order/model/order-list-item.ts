import type { OrderDirection } from "./order-direction";
import type { OrderBadge, PublicOrder } from "./types";

/** Общие данные карточки в списке и прежние значения изменённых условий. */
interface OrderListItemFields extends PublicOrder {
  customer_id: number;
  customer_name: string;
  customer_inn: string;
  requires_expert: boolean;
  requires_license: boolean;
  sum_amount_raw: number;
  executor_name: string;
  executor_avatar_url: string | null;
  executor_rating: number | null;
  executor_review_count: number;
  executor_public_id: string;
  executor_proposed_sum: string;
  executor_proposed_start_date: string;
  executor_proposed_deadline: string;
  executor_comment: string;
  executor_files: string[];
  accepted_response_id: number | null;
  customer_has_review: boolean;
  created_at_display: string;
  status: "ACTIVE" | "ARCHIVED";
  previous_title: string | null;
  previous_comment: string | null;
  previous_sum: string | null;
  previous_date: string | null;
  previous_badges: OrderBadge[] | null;
}

/** Карточка заказа; направление определяет точный тип дополнительных условий. */
export type OrderListItem = OrderListItemFields & OrderDirection;
