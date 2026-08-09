"use client";

import { useEffect } from "react";
import {
  fetchContactDeals,
  fetchContactOffer,
  fetchExpertContacts,
} from "@/source/entities/expert-contact";
import { useSession } from "@/source/features/session";
import { useNotifications } from "@/source/shared/ui/Notifications";
import type { SortDir } from "@/source/shared/ui/SortPills";
import { filterExperts } from "../lib/filterExperts";
import { useExpertContactsContext } from "./provider";
import type { ContactAccessFilter } from "./types";

export function useMarketplace() {
  const { state, dispatch } = useExpertContactsContext();
  const { role, user, isLoading: sessionLoading } = useSession();
  const { showError } = useNotifications();
  const userId = user?.id ?? null;

  useEffect(() => {
    if (sessionLoading) return;
    let canceled = false;

    const load = async () => {
      dispatch({ type: "LOAD_PENDING" });
      try {
        const [experts, deals, offer] = await Promise.all([
          fetchExpertContacts(),
          userId ? fetchContactDeals() : Promise.resolve([]),
          userId && role === "EXPERT" ? fetchContactOffer() : Promise.resolve(null),
        ]);
        if (canceled) return;
        dispatch({ type: "LOAD_FULFILLED", experts, deals, offer });
      } catch (reason) {
        if (canceled) return;
        dispatch({ type: "LOAD_REJECTED" });
        showError(reason instanceof Error ? reason.message : "Не удалось загрузить раздел");
      }
    };

    void load();
    return () => {
      canceled = true;
    };
  }, [dispatch, role, sessionLoading, showError, userId]);

  return {
    role,
    loading: state.loading,
    busy: state.busy,
    deals: state.deals,
    offer: state.offer,
    search: state.search,
    accessFilter: state.accessFilter,
    ratingSort: state.ratingSort,
    experts: filterExperts(state.experts, state.search, state.accessFilter, state.ratingSort),
    accessCounts: {
      ALL: state.experts.length,
      OPEN: state.experts.filter((expert) => expert.sales_enabled).length,
      CLOSED: state.experts.filter((expert) => !expert.sales_enabled).length,
    },
    setSearch: (value: string) => dispatch({ type: "SEARCH", value }),
    setAccessFilter: (value: ContactAccessFilter) => dispatch({ type: "ACCESS_FILTER", value }),
    setRatingSort: (value: SortDir | null) => dispatch({ type: "RATING_SORT", value }),
  };
}
