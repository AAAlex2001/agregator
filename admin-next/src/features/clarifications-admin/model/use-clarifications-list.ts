"use client";

import { useEffect, useReducer } from "react";
import { fetchClarifications } from "../api/clarifications";
import { listReducer } from "./reducers";

/** Список разъяснений с фильтром по статусу публикации. */
export const useClarificationsList = () => {
  const [state, dispatch] = useReducer(listReducer, { filter: "", list: null, loading: true, failed: false });
  const { filter } = state;

  useEffect(() => {
    let active = true;

    fetchClarifications(filter)
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
