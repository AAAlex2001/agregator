import type { OrderList, OrderListQuery } from "@/entities/order";

export type OrdersState = {
  search: string;
  filters: OrderListQuery;
  page: number;
  list: OrderList | null;
  loading: boolean;
  failed: boolean;
};

export type OrdersAction =
  | { type: "search/change"; value: string }
  | { type: "load/start"; filters: OrderListQuery; page: number }
  | { type: "load/success"; list: OrderList }
  | { type: "load/error" };
