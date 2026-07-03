"use client";

import { useCallback, useEffect, useReducer } from "react";
import {
  fetchTechExpertAutocomplete,
  fetchTechExpertDocument,
  fetchTechExpertDocuments,
  type TechExpertTip,
} from "@/source/entities/tech-expert";
import { initialState, reducer } from "./reducer";

const MIN_QUERY = 2;

export function useTechExpertSearch() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const q = state.query.trim();
    if (q.length < MIN_QUERY) {
      dispatch({ type: "tips", tips: [] });
      return;
    }
    let active = true;
    const timer = setTimeout(async () => {
      try {
        const data = await fetchTechExpertAutocomplete(q);
        if (active) dispatch({ type: "tips", tips: data });
      } catch {
        if (active) dispatch({ type: "tips", tips: [] });
      }
    }, 250);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [state.query]);

  const search = useCallback(
    async (term?: string) => {
      const q = (term ?? state.query).trim();
      if (!q) return;
      dispatch({ type: "searchStart" });
      try {
        const data = await fetchTechExpertDocuments(q);
        dispatch({ type: "searchSuccess", results: data });
      } catch (e) {
        dispatch({ type: "searchError", error: e instanceof Error ? e.message : "Не удалось выполнить поиск" });
      }
    },
    [state.query],
  );

  const pickTip = useCallback(
    (tip: TechExpertTip) => {
      dispatch({ type: "query", value: tip.value });
      void search(tip.value);
    },
    [search],
  );

  const openDocument = useCallback(async (id: number) => {
    dispatch({ type: "detailStart" });
    try {
      const card = await fetchTechExpertDocument(id);
      dispatch({ type: "detailSuccess", detail: card });
    } catch (e) {
      dispatch({ type: "detailError", error: e instanceof Error ? e.message : "Не удалось открыть документ" });
    }
  }, []);

  return {
    state,
    setQuery: (value: string) => dispatch({ type: "query", value }),
    setTipsOpen: (value: boolean) => dispatch({ type: "tipsOpen", value }),
    search,
    pickTip,
    openDocument,
    closeDetail: () => dispatch({ type: "detailClose" }),
  };
}
