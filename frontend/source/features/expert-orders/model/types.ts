import type { OrderCardData, OrderApiItem } from "@/source/entities/order";

export interface ExpertOrdersState {
  items: OrderCardData[];
  total: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  selectedOrder: OrderCardData | null;
  isResponding: boolean;
}

export type OrderWsEvent =
  | { event: "order_created"; data: OrderApiItem }
  | { event: "order_updated"; data: OrderApiItem }
  | { event: "order_removed"; data: { id: number } };
