import type { OrderCardData } from "@/source/entities/order";

export interface ExpertOrdersState {
  items: OrderCardData[];
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  selectedOrder: OrderCardData | null;
  isResponding: boolean;
}
