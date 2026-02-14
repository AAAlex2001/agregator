import type { Badge } from "@/app/orders/components/OrderCard";

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
  date: string;
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
  sum: string;
  comment: string;
  technicalFiles: string[];
}

export interface OrdersState {
  items: OrderCardViewModel[];
  total: number;
  isLoading: boolean;
  error: string | null;
}
