"use client";

import { useEffect, useReducer } from "react";
import { fetchDeals } from "../api/deals";
import { dealsReducer } from "./reducers";

/** Список сделок с фильтром по статусу. */
export const useDealsList = () => {
  const [state, dispatch] = useReducer(dealsReducer, { filter: "", list: null, loading: true, failed: false });
  const { filter } = state;

  useEffect(() => {
    let active = true;

    fetchDeals(filter)
      .then((list) => {
        if (active) dispatch({ type: "load/success", list });
      })
      .catch(() => {
        if (active) dispatch({ type: "load/error" });
      });

    return () => {
      active = false;
    };
  }, [filter]);

  const changeFilter = (value: string) => dispatch({ type: "load/start", filter: value });

  return { state, changeFilter };
};
