import type { Badge } from "@/app/expert/orders/types";

export interface OrderBadgeResponse {
  text: string;
  variant: string;
}

export interface OrderResponse {
  id: number;
  title: string;
  comment: string;
  customer_id: number;
  customer_name: string;
  sum: string;
  sum_amount_raw: number;
  commission_amount: string;
  commission_amount_raw: number;
  date: string;
  responses_deadline: string | null;
  technical_files: string[];
  badges: OrderBadgeResponse[];
  status: string;
}

export interface OrdersListResponse {
  items: OrderResponse[];
  total: number;
}

export interface OrderCardViewModel {
  id: number;
  badges: Badge[];
  title: string;
  customer: string;
  date: string;
  responsesDeadline?: string | null;
  sum: string;
  commissionAmount: string;
  commissionAmountRaw: number;
  comment: string;
  technicalFiles: string[];
}

export interface OrdersState {
  items: OrderCardViewModel[];
  total: number;
  isLoading: boolean;
  error: string | null;
}

export type OrderWsEvent =
  | { event: "order_created"; data: OrderResponse }
  | { event: "order_updated"; data: OrderResponse }
  | { event: "order_removed"; data: { id: number } };
