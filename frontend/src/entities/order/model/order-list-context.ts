"use client";

import { createContext, useContext } from "react";
import type { Dispatch, RefObject } from "react";
import type { OrderListPage, OrderListType } from "./order-list";
import type { OrderListAction, OrderListState } from "./order-list-state";

/** Данные списка и версия запроса, защищающая его от ответов старой сортировки. */
interface OrderListContextValue {
  state: OrderListState;
  dispatch: Dispatch<OrderListAction>;
  initialPage?: OrderListPage;
  listType: OrderListType;
  expertPublicId?: string;
  requestVersionRef: RefObject<number>;
}

export const OrderListContext = createContext<OrderListContextValue | null>(null);

/** Даёт операциям доступ к одному списку заказов. */
export function useOrderListContext() {
  const context = useContext(OrderListContext);

  if (!context) {
    throw new Error("Список заказов должен находиться внутри OrderListProvider");
  }

  return context;
}

/** Возвращает список и состояние загрузки для его отображения. */
export function useOrderList() {
  return useOrderListContext().state;
}
