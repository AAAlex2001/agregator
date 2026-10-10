"use client";

import { useEffect, useReducer } from "react";
import { fetchOrders, type OrderListQuery } from "@/entities/order";
import { ordersReducer } from "./reducers";

const PAGE_SIZE = 50;

/** Список заказов админки: фильтры по статусу и направлению, поиск и листание страниц. */
export const useOrdersList = () => {
  const [state, dispatch] = useReducer(ordersReducer, {
    search: "",
    filters: { status: "", workType: "", query: "" },
    page: 1,
    list: null,
    loading: true,
    failed: false,
  });
  const { filters, page } = state;

  useEffect(() => {
    let active = true;

    fetchOrders(filters, PAGE_SIZE, (page - 1) * PAGE_SIZE)
      .then((list) => {
        if (active) dispatch({ type: "load/success", list });
      })
      .catch(() => {
        if (active) dispatch({ type: "load/error" });
      });

    return () => {
      active = false;
    };
  }, [filters, page]);

  const changeSearch = (value: string) => dispatch({ type: "search/change", value });

  const changeFilters = (nextFilters: OrderListQuery) => dispatch({ type: "load/start", filters: nextFilters, page: 1 });

  const submitSearch = () => changeFilters({ ...filters, query: state.search.trim() });

  const openPage = (nextPage: number) => dispatch({ type: "load/start", filters, page: nextPage });

  const pages = Math.ceil((state.list?.total ?? 0) / PAGE_SIZE);

  return { state, pages, changeSearch, changeFilters, submitSearch, openPage };
};
