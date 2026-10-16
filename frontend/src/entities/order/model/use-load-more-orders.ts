"use client";

import { getOrderListPage } from "../api/get-order-list-page";
import { ORDERS_PAGE_SIZE } from "./order-list";
import { useOrderListContext } from "./order-list-context";

/** Догружает следующую страницу в текущем порядке. */
export function useLoadMoreOrders() {
  const {
    state,
    dispatch,
    listType,
    expertPublicId,
    requestVersionRef,
  } = useOrderListContext();

  /** Добавляет ответ только к тому порядку, для которого запрашивалась страница. */
  async function loadMoreOrders() {
    if (state.operation !== "idle" || !state.hasMore) {
      return;
    }

    const requestVersion = requestVersionRef.current;

    dispatch({
      type: "more/started",
    });

    try {
      const page = await getOrderListPage(
        {
          skip: state.items.length,
          limit: ORDERS_PAGE_SIZE,
          sort: state.sort,
        },
        listType,
        expertPublicId,
      );

      if (requestVersion === requestVersionRef.current) {
        dispatch({
          type: "more/loaded",
          page,
        });
      }
    } catch (error) {
      if (requestVersion === requestVersionRef.current) {
        dispatch({
          type: "request/failed",
          error:
            error instanceof Error ? error.message : "Не удалось загрузить заказы",
        });
      }
    }
  }

  return loadMoreOrders;
}
