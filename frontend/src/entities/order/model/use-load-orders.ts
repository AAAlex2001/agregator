"use client";

import { getOrderListPage } from "../api/get-order-list-page";
import type { OrderSort } from "./order-list";
import { useOrderListContext } from "./order-list-context";

/** Загружает первую страницу выбранного порядка вместо прежнего списка. */
export function useLoadOrders() {
  const { dispatch, pageSize, listType, requestVersionRef } = useOrderListContext();

  /** Применяет ответ, только если пользователь ещё не выбрал другую сортировку. */
  async function loadOrders(sort: OrderSort) {
    const requestVersion = ++requestVersionRef.current;

    dispatch({
      type: "page/started",
      sort,
    });

    try {
      const page = await getOrderListPage(
        {
          skip: 0,
          limit: pageSize,
          sort,
        },
        listType,
      );

      if (requestVersion === requestVersionRef.current) {
        dispatch({
          type: "page/loaded",
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

  return loadOrders;
}
