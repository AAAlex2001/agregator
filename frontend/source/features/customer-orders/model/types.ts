import type { OrderCardData } from "@/source/entities/order";

export type Mode = "list" | "create" | "edit";

export interface CustomerOrdersState {
  items: OrderCardData[];
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  mode: Mode;
  editTarget: OrderCardData | null;
  submitting: boolean;
  deletingId: number | null;
}
