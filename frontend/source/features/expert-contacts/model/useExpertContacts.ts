"use client";

import { useEffect, useReducer } from "react";
import {
  confirmContactPayment,
  createContactDeal,
  fetchContactDeal,
  fetchContactDeals,
  fetchContactOffer,
  fetchExpertContacts,
  rejectContactPayment,
  signContactDeal,
  updateContactOffer,
  uploadContactReceipt,
  type ExpertContactCardData,
} from "@/source/entities/expert-contact";
import { useSession } from "@/source/features/session";
import {
  expertContactsReducer,
  initialExpertContactsState,
} from "./reducer";

export function useExpertContacts() {
  const { role } = useSession();
  const [state, dispatch] = useReducer(
    expertContactsReducer,
    initialExpertContactsState,
  );

  const loadInitialData = async () => {
    dispatch({ type: "LOADING", value: true });
    dispatch({ type: "ERROR", value: null });
    try {
      const [experts, deals, offer] = await Promise.all([
        fetchExpertContacts(),
        fetchContactDeals(),
        role === "EXPERT" ? fetchContactOffer() : Promise.resolve(null),
      ]);
      dispatch({ type: "EXPERTS", value: experts });
      dispatch({ type: "DEALS", value: deals });
      dispatch({ type: "OFFER", value: offer });
    } catch (reason) {
      dispatch({
        type: "ERROR",
        value: reason instanceof Error ? reason.message : "Не удалось загрузить раздел",
      });
    } finally {
      dispatch({ type: "LOADING", value: false });
    }
  };

  useEffect(() => {
    void loadInitialData();
    // Загрузка зависит только от активной роли пользователя.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const runDealAction = async (
    action: () => Promise<Awaited<ReturnType<typeof fetchContactDeal>>>,
  ) => {
    dispatch({ type: "BUSY", value: true });
    dispatch({ type: "ERROR", value: null });
    try {
      const deal = await action();
      dispatch({ type: "SELECT_DEAL", value: deal });
      dispatch({ type: "SYNC_DEAL", value: deal });
      dispatch({ type: "DEALS", value: await fetchContactDeals() });
    } catch (reason) {
      dispatch({
        type: "ERROR",
        value: reason instanceof Error ? reason.message : "Не удалось выполнить действие",
      });
    } finally {
      dispatch({ type: "BUSY", value: false });
    }
  };

  const openExpert = async (expert: ExpertContactCardData) => {
    await runDealAction(() => (
      expert.deal_id
        ? fetchContactDeal(expert.deal_id)
        : createContactDeal(expert.id)
    ));
  };

  const openDeal = async (id: number) => {
    await runDealAction(() => fetchContactDeal(id));
  };

  const normalizedSearch = state.search.trim().toLocaleLowerCase("ru-RU");
  let visibleExperts = state.experts.filter((expert) => {
    const matchesSearch = !normalizedSearch
      || expert.name.toLocaleLowerCase("ru-RU").includes(normalizedSearch);
    const matchesAccess = state.accessFilter === "ALL"
      || (state.accessFilter === "OPEN" && expert.sales_enabled)
      || (state.accessFilter === "CLOSED" && !expert.sales_enabled);
    return matchesSearch && matchesAccess;
  });

  if (state.ratingSort) {
    visibleExperts = [...visibleExperts].sort((first, second) => {
      if (first.rating === null) return second.rating === null ? 0 : 1;
      if (second.rating === null) return -1;
      return state.ratingSort === "desc"
        ? second.rating - first.rating
        : first.rating - second.rating;
    });
  }

  const accessCounts = {
    ALL: state.experts.length,
    OPEN: state.experts.filter((expert) => expert.sales_enabled).length,
    CLOSED: state.experts.filter((expert) => !expert.sales_enabled).length,
  };

  return {
    ...state,
    experts: visibleExperts,
    totalExperts: state.experts.length,
    role,
    setSearch: (value: string) => dispatch({ type: "SEARCH", value }),
    setAccessFilter: (value: typeof state.accessFilter) => (
      dispatch({ type: "ACCESS_FILTER", value })
    ),
    setRatingSort: (value: typeof state.ratingSort) => (
      dispatch({ type: "RATING_SORT", value })
    ),
    accessCounts,
    openExpert,
    openDeal,
    closeDeal: () => dispatch({ type: "SELECT_DEAL", value: null }),
    saveOffer: async (payload: Parameters<typeof updateContactOffer>[0]) => {
      dispatch({ type: "BUSY", value: true });
      dispatch({ type: "ERROR", value: null });
      try {
        const offer = await updateContactOffer(payload);
        dispatch({ type: "SYNC_OFFER", value: offer });
        return true;
      } catch (reason) {
        dispatch({
          type: "ERROR",
          value: reason instanceof Error ? reason.message : "Не удалось сохранить настройки",
        });
        return false;
      } finally {
        dispatch({ type: "BUSY", value: false });
      }
    },
    sign: (password: string) => state.selectedDeal
      ? runDealAction(() => signContactDeal(state.selectedDeal!.id, password))
      : Promise.resolve(),
    uploadReceipt: (file: File) => state.selectedDeal
      ? runDealAction(() => uploadContactReceipt(state.selectedDeal!.id, file))
      : Promise.resolve(),
    confirmPayment: () => state.selectedDeal
      ? runDealAction(() => confirmContactPayment(state.selectedDeal!.id))
      : Promise.resolve(),
    rejectPayment: (reason: string) => state.selectedDeal
      ? runDealAction(() => rejectContactPayment(state.selectedDeal!.id, reason))
      : Promise.resolve(),
  };
}
