"use client";

import { useEffect, useReducer } from "react";
import { fetchArticles, type ArticleListQuery } from "@/entities/article";
import { listReducer } from "./reducers";

const PAGE_SIZE = 50;

/** Список статей админки: фильтры по типу, статусу и обсуждениям, порядок по просмотрам, поиск и листание. */
export const useArticlesList = () => {
  const [state, dispatch] = useReducer(listReducer, {
    search: "",
    filters: { kind: "", status: "", query: "", withComments: false, views: "" },
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

  const changeFilters = (nextFilters: ArticleListQuery) => dispatch({ type: "load/start", filters: nextFilters, page: 1 });

  const submitSearch = () => changeFilters({ ...filters, query: state.search.trim() });

  const openPage = (nextPage: number) => dispatch({ type: "load/start", filters, page: nextPage });

  const pages = Math.ceil((state.list?.total ?? 0) / PAGE_SIZE);

  return { state, pages, changeSearch, changeFilters, submitSearch, openPage };
};
