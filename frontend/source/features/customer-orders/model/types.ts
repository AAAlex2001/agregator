import type { OrderCardData } from "@/source/entities/order";

export type Mode = "list" | "create" | "edit";

export interface CustomerOrdersState {
  items: OrderCardData[];
  total: number;
  isLoading: boolean;
  error: string | null;
  mode: Mode;
  editTarget: OrderCardData | null;
  submitting: boolean;
  deletingId: number | null;
}
