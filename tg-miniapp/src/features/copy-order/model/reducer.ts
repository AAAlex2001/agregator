import type { OrderCopyAction, OrderCopyState } from "./types";

export const initialOrderCopyState: OrderCopyState = {
  editOrder: null,
  pickerOpen: false,
  context: "create",
  template: null,
  hasCopyableOrders: false,
};

export function orderCopyReducer(state: OrderCopyState, action: OrderCopyAction): OrderCopyState {
  switch (action.type) {
    case "availability":
      return { ...state, hasCopyableOrders: action.value };
    case "openEdit":
      return { ...state, editOrder: action.order, template: null };
    case "closeEdit":
      return { ...state, editOrder: null };
    case "openPicker":
      return { ...state, pickerOpen: true, context: action.context };
    case "closePicker":
      return { ...state, pickerOpen: false };
    case "selectTemplate":
      return { ...state, pickerOpen: false, template: action.order };
    case "startBlank":
      return { ...state, context: "create", template: null };
  }
}
