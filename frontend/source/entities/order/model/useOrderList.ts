"use client";

import { useEffect, useReducer, useState } from "react";
import { mapApiToOrderCard } from "./mapper";
import type { OrderCardData, OrdersApiList } from "./types";

export const ORDERS_PAGE_SIZE = 50;

interface OrderListState {
  items: OrderCardData[];
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string;
}

type OrderListAction =
  | { type: "page/success"; page: OrdersApiList }
  | { type: "page/error"; error: string }
  | { type: "more/start" }
  | { type: "more/success"; page: OrdersApiList }
  | { type: "more/error"; error: string }
  | { type: "remove"; id: number };

function reducer(state: OrderListState, action: OrderListAction): OrderListState {
  switch (action.type) {
    case "page/success":
      return { ...state, items: action.page.items.map(mapApiToOrderCard), hasMore: action.page.has_more, isLoading: false };
    case "page/error":
      return { ...state, isLoading: false, error: action.error };
    case "more/start":
      return { ...state, isLoadingMore: true };
    case "more/success":
      return {
        ...state,
        items: [...state.items, ...action.page.items.map(mapApiToOrderCard)],
        hasMore: action.page.has_more,
        isLoadingMore: false,
      };
    case "more/error":
      return { ...state, isLoadingMore: false, error: action.error };
    case "remove":
      return { ...state, items: state.items.filter((item) => item.id !== action.id) };
  }
}

/** Список заказов со страницами. Первая страница либо приходит готовой (initial), либо грузится при монтировании. */
export function useOrderList(fetchPage: (skip: number) => Promise<OrdersApiList>, initial?: OrdersApiList) {
  const [load] = useState(() => fetchPage);
  const [state, dispatch] = useReducer(reducer, initial, (page) => ({
    items: page ? page.items.map(mapApiToOrderCard) : [],
    hasMore: page?.has_more ?? false,
    isLoading: !page,
    isLoadingMore: false,
    error: "",
  }));

  useEffect(() => {
    if (initial) return;
    let cancelled = false;
    load(0)
      .then((page) => {
        if (!cancelled) dispatch({ type: "page/success", page });
      })
      .catch((error) => {
        if (!cancelled) dispatch({ type: "page/error", error: error instanceof Error ? error.message : "Не удалось загрузить заказы" });
      });
    return () => {
      cancelled = true;
    };
  }, [load, initial]);

  const loadMore = async () => {
    if (state.isLoading || state.isLoadingMore || !state.hasMore) return;
    dispatch({ type: "more/start" });
    try {
      dispatch({ type: "more/success", page: await load(state.items.length) });
    } catch (error) {
      dispatch({ type: "more/error", error: error instanceof Error ? error.message : "Не удалось загрузить заказы" });
    }
  };

  return { ...state, loadMore, remove: (id: number) => dispatch({ type: "remove", id }) };
}
