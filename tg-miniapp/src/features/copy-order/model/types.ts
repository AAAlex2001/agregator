import type { Order } from "@/entites/order";

export type CopyOrderContext = "create" | "edit";

export interface OrderCopyState {
  editOrder: Order | null;
  pickerOpen: boolean;
  context: CopyOrderContext;
  template: Order | null;
  hasCopyableOrders: boolean;
}

export type OrderCopyAction =
  | { type: "availability"; value: boolean }
  | { type: "openEdit"; order: Order }
  | { type: "closeEdit" }
  | { type: "openPicker"; context: CopyOrderContext }
  | { type: "closePicker" }
  | { type: "selectTemplate"; order: Order }
  | { type: "startBlank" };

export interface UseOrderCopyFlowOptions {
  enabled: boolean;
  refreshKey: number;
  onOpenCreate: () => void;
}
