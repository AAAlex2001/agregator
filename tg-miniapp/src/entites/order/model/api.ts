import { apiJson } from "@/shared/services/api";

export interface OrderBadge {
  text: string;
  variant: string;
}

export interface Order {
  id: number;
  public_id: string;
  title: string;
  company: string;
  sum: string;
  date: string;
  badges: OrderBadge[];
  status: string;
  responses_deadline: string | null;
}

export interface OrderList {
  items: Order[];
  has_more: boolean;
}

export const listOrders = (limit = 10) =>
  apiJson<OrderList>(`/orders/?skip=0&limit=${limit}`);
