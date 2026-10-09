"use client";

import { useEffect, useReducer } from "react";
import { fetchArticles } from "../api/articles";
import { listReducer } from "./reducers";
import type { ListFilters } from "./types";

const PAGE_SIZE = 50;

const EMPTY_FILTERS: ListFilters = { kind: "", status: "", query: "" };

/** Список статей админки: фильтры по типу и статусу, поиск и листание страниц. */
export const useArticlesList = () => {
  const [state, dispatch] = useReducer(listReducer, {
    search: "",
    filters: EMPTY_FILTERS,
    page: 1,
    list: null,
    loading: true,
    failed: false,
  });
  const { filters, page } = state;

  useEffect(() => {
    let active = true;

    fetchArticles(filters, PAGE_SIZE, (page - 1) * PAGE_SIZE)
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

  const changeFilter = (changes: Partial<ListFilters>) =>
    dispatch({ type: "load/start", filters: { ...filters, ...changes }, page: 1 });

  const submitSearch = () => changeFilter({ query: state.search.trim() });

  const openPage = (nextPage: number) => dispatch({ type: "load/start", filters, page: nextPage });

  const pages = Math.ceil((state.list?.total ?? 0) / PAGE_SIZE);

  return { state, pages, changeSearch, changeFilter, submitSearch, openPage };
};
