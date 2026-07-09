import { useEffect, useReducer, useRef } from "react";
import { listArchivedOrders, listOrders, type Order } from "@/entites/order";
import { initialOrderCopyState, orderCopyReducer } from "./reducer";
import type { CopyOrderContext, UseOrderCopyFlowOptions } from "./types";

export function useOrderCopyFlow({ enabled, refreshKey, onOpenCreate }: UseOrderCopyFlowOptions) {
  const [state, dispatch] = useReducer(orderCopyReducer, initialOrderCopyState);
  const returnAnchor = useRef<{ id: number; top: number } | null>(null);

  useEffect(() => {
    if (!enabled) return;
    Promise.all([listOrders(1), listArchivedOrders(1)])
      .then(([active, archived]) => {
        dispatch({ type: "availability", value: active.items.length > 0 || archived.items.length > 0 });
      })
      .catch(() => dispatch({ type: "availability", value: false }));
  }, [enabled, refreshKey]);

  const openEdit = (order: Order) => {
    const card = document.querySelector<HTMLElement>(`[data-customer-order-id="${order.id}"]`);
    returnAnchor.current = { id: order.id, top: card?.getBoundingClientRect().top ?? 24 };
    dispatch({ type: "openEdit", order });
  };

  const openPicker = (context: CopyOrderContext) => {
    dispatch({ type: "openPicker", context });
  };

  const selectTemplate = (order: Order) => {
    dispatch({ type: "selectTemplate", order });
    if (state.context === "create") onOpenCreate();
  };

  const startBlank = () => {
    dispatch({ type: "startBlank" });
    onOpenCreate();
  };

  const finishEdit = (refresh: () => void) => {
    dispatch({ type: "closeEdit" });
    refresh();
    const anchor = returnAnchor.current;
    if (!anchor) return;
    window.setTimeout(() => {
      const card = document.querySelector<HTMLElement>(`[data-customer-order-id="${anchor.id}"]`);
      if (card) window.scrollBy({ top: card.getBoundingClientRect().top - anchor.top });
      returnAnchor.current = null;
    }, 350);
  };

  return {
    editOrder: state.editOrder,
    closeEdit: () => dispatch({ type: "closeEdit" }),
    copyOpen: state.pickerOpen,
    closePicker: () => dispatch({ type: "closePicker" }),
    copyTemplate: state.template,
    copyContext: state.context,
    hasCopyableOrders: state.hasCopyableOrders,
    openEdit,
    openPicker,
    selectTemplate,
    startBlank,
    finishEdit,
  };
}
