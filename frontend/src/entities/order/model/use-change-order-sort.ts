"use client";

import type { OrderSort } from "./order-list";
import { useOrderListContext } from "./order-list-context";
import { useLoadOrders } from "./use-load-orders";

/** Меняет порядок заказов или восстанавливает исходную страницу сервера. */
export function useChangeOrderSort() {
  const { state, dispatch, initialPage, requestVersionRef } = useOrderListContext();
  const loadOrders = useLoadOrders();

  /** Сбрасывает порядок к серверной странице либо заново загружает клиентский список. */
  async function changeOrderSort(sort: OrderSort) {
    if (
      sort.field === state.sort.field &&
      sort.direction === state.sort.direction
    ) {
      return;
    }

    if (sort.field === null && initialPage) {
      requestVersionRef.current += 1;

      dispatch({
        type: "sort/reset",
        page: initialPage,
      });
      return;
    }

    await loadOrders(sort);
  }

  return changeOrderSort;
}
