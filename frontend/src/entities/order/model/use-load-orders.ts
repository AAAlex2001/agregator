"use client";

import { getOrderListPage } from "../api/get-order-list-page";
import { ORDERS_PAGE_SIZE } from "./order-list";
import type { OrderSort } from "./order-list";
import { useOrderListContext } from "./order-list-context";

/** Загружает первую страницу выбранного порядка вместо прежнего списка. */
export function useLoadOrders() {
  const { dispatch, listType, requestVersionRef } = useOrderListContext();

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
          limit: ORDERS_PAGE_SIZE,
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
