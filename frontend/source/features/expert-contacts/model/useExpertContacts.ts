"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  confirmContactPayment,
  createContactDeal,
  createContactDealReview,
  deleteContactDeal,
  fetchContactDeal,
  fetchContactDeals,
  fetchContactOffer,
  fetchExpertContacts,
  openDealChat as openDealChatApi,
  rejectContactPayment,
  signContactDeal,
  updateContactOffer,
  uploadContactReceipt,
  type ContactDealDetail,
  type ContactDealListItem,
  type ExpertContactCardData,
} from "@/source/entities/expert-contact";
import { useSession } from "@/source/features/session";
import { useNotifications } from "@/source/shared/ui/Notifications";
import {
  expertContactsReducer,
  initialExpertContactsState,
} from "./reducer";

function errorMessage(reason: unknown, fallback: string): string {
  return reason instanceof Error ? reason.message : fallback;
}

export function useExpertContacts(targetExpertId?: string) {
  const router = useRouter();
  const { role, user, isLoading: sessionLoading } = useSession();
  const { showError, showSuccess } = useNotifications();
  const [state, dispatch] = useReducer(
    expertContactsReducer,
    initialExpertContactsState,
  );
  const [dealChatUuid, setDealChatUuid] = useState<string | null>(null);
  const requestInFlightRef = useRef(false);
  const userId = user?.id ?? null;

  useEffect(() => {
    if (sessionLoading) return;
    let canceled = false;

    const load = async () => {
      dispatch({ type: "LOADING", value: true });
      dispatch({ type: "ERROR", value: null });
      try {
        const [experts, deals, offer] = await Promise.all([
          fetchExpertContacts(),
          userId ? fetchContactDeals() : Promise.resolve([]),
          userId && role === "EXPERT"
            ? fetchContactOffer()
            : Promise.resolve(null),
        ]);
        if (canceled) return;
        dispatch({ type: "EXPERTS", value: experts });
        dispatch({ type: "DEALS", value: deals });
        dispatch({ type: "OFFER", value: offer });
      } catch (reason) {
        if (!canceled) {
          showError(errorMessage(reason, "Не удалось загрузить раздел"));
        }
      } finally {
        if (!canceled) dispatch({ type: "LOADING", value: false });
      }
    };

    void load();
    return () => {
      canceled = true;
    };
  }, [role, sessionLoading, showError, userId]);

  const beginRequest = (): boolean => {
    if (requestInFlightRef.current) return false;
    requestInFlightRef.current = true;
    dispatch({ type: "BUSY", value: true });
    dispatch({ type: "ERROR", value: null });
    return true;
  };

  const finishRequest = () => {
    requestInFlightRef.current = false;
    dispatch({ type: "BUSY", value: false });
  };

  const setRequestError = (reason: unknown, fallback: string): string => {
    const message = errorMessage(reason, fallback);
    dispatch({ type: "ERROR", value: message });
    return message;
  };

  const refreshMarketplace = async () => {
    const [experts, deals] = await Promise.all([
      fetchExpertContacts(),
      fetchContactDeals(),
    ]);
    dispatch({ type: "EXPERTS", value: experts });
    dispatch({ type: "DEALS", value: deals });
  };

  const runDealAction = async (
    request: () => Promise<ContactDealDetail>,
    successMessage?: string,
  ): Promise<void> => {
    if (!beginRequest()) return;
    try {
      const deal = await request();
      dispatch({ type: "SELECT_DEAL", value: deal });
      dispatch({ type: "SYNC_DEAL", value: deal });
      dispatch({ type: "DEALS", value: await fetchContactDeals() });
      if (successMessage) showSuccess(successMessage);
    } catch (reason) {
      showError(setRequestError(reason, "Не удалось выполнить действие"));
    } finally {
      finishRequest();
    }
  };

  const openExpert = async (expert: ExpertContactCardData) => {
    if (!userId) {
      router.push("/login");
      return;
    }
    await runDealAction(
      () => (
        expert.deal_id
          ? fetchContactDeal(expert.deal_id)
          : createContactDeal(expert.id)
      ),
      expert.deal_id ? undefined : "Заявка на покупку контактов создана",
    );
  };

  const confirmDeleteDeal = async () => {
    const deal = state.deleteDeal;
    if (!deal || !beginRequest()) return;
    try {
      await deleteContactDeal(deal.id);
      await refreshMarketplace();
      dispatch({ type: "DELETE_DEAL", value: null });
      showSuccess("Заявка на контакты удалена");
    } catch (reason) {
      showError(setRequestError(
        reason,
        "Не удалось удалить заявку на контакты",
      ));
    } finally {
      finishRequest();
    }
  };

  const submitReview = async (
    payload: { rating: number; comment: string },
  ): Promise<void> => {
    const deal = state.reviewDeal;
    if (!deal || !beginRequest()) return;
    try {
      await createContactDealReview(deal.id, payload);
      await refreshMarketplace();
      dispatch({ type: "REVIEW_DEAL", value: null });
      showSuccess("Отзыв опубликован");
    } catch (reason) {
      showError(setRequestError(reason, "Не удалось опубликовать отзыв"));
      throw reason;
    } finally {
      finishRequest();
    }
  };

  const openDealChat = async (dealId: number) => {
    if (!beginRequest()) return;
    try {
      setDealChatUuid(await openDealChatApi(dealId));
    } catch (reason) {
      showError(setRequestError(reason, "Не удалось открыть чат"));
    } finally {
      finishRequest();
    }
  };

  const saveOffer = async (
    payload: Parameters<typeof updateContactOffer>[0],
  ): Promise<boolean> => {
    if (!beginRequest()) return false;
    try {
      const offer = await updateContactOffer(payload);
      dispatch({ type: "SYNC_OFFER", value: offer });
      return true;
    } catch (reason) {
      showError(setRequestError(reason, "Не удалось сохранить настройки"));
      return false;
    } finally {
      finishRequest();
    }
  };

  const selectedDealAction = (
    request: (dealId: number) => Promise<ContactDealDetail>,
    successMessage: string,
  ): Promise<void> => {
    const deal = state.selectedDeal;
    return deal
      ? runDealAction(() => request(deal.id), successMessage)
      : Promise.resolve();
  };

  const normalizedSearch = state.search.trim().toLocaleLowerCase("ru-RU");
  let experts = state.experts.filter((expert) => {
    const matchesSearch = !normalizedSearch
      || expert.name.toLocaleLowerCase("ru-RU").includes(normalizedSearch);
    const matchesAccess = state.accessFilter === "ALL"
      || (state.accessFilter === "OPEN" && expert.sales_enabled)
      || (state.accessFilter === "CLOSED" && !expert.sales_enabled);
    return matchesSearch && matchesAccess;
  });
  if (state.ratingSort) {
    experts = [...experts].sort((first, second) => {
      if (first.rating === null) return second.rating === null ? 0 : 1;
      if (second.rating === null) return -1;
      return state.ratingSort === "desc"
        ? second.rating - first.rating
        : first.rating - second.rating;
    });
  }

  return {
    ...state,
    experts,
    totalExperts: state.experts.length,
    targetExpertId: targetExpertId ?? null,
    role,
    dealChatUuid,
    accessCounts: {
      ALL: state.experts.length,
      OPEN: state.experts.filter((expert) => expert.sales_enabled).length,
      CLOSED: state.experts.filter((expert) => !expert.sales_enabled).length,
    },
    setSearch: (value: string) => dispatch({ type: "SEARCH", value }),
    setAccessFilter: (value: typeof state.accessFilter) => (
      dispatch({ type: "ACCESS_FILTER", value })
    ),
    setRatingSort: (value: typeof state.ratingSort) => (
      dispatch({ type: "RATING_SORT", value })
    ),
    openExpert,
    openDeal: (id: number) => runDealAction(() => fetchContactDeal(id)),
    closeDeal: () => dispatch({ type: "SELECT_DEAL", value: null }),
    requestDeleteDeal: (deal: ContactDealListItem) => (
      dispatch({ type: "DELETE_DEAL", value: deal })
    ),
    confirmDeleteDeal,
    cancelDeleteDeal: () => dispatch({ type: "DELETE_DEAL", value: null }),
    startReview: () => {
      if (!state.selectedDeal?.can_review) return;
      dispatch({ type: "REVIEW_DEAL", value: state.selectedDeal });
      dispatch({ type: "SELECT_DEAL", value: null });
    },
    submitReview,
    closeReview: () => dispatch({ type: "REVIEW_DEAL", value: null }),
    openDealChat,
    closeDealChat: () => setDealChatUuid(null),
    saveOffer,
    sign: (password: string) => selectedDealAction(
      (dealId) => signContactDeal(dealId, password),
      "Договор подписан",
    ),
    uploadReceipt: (file: File) => selectedDealAction(
      (dealId) => uploadContactReceipt(dealId, file),
      "Чек отправлен",
    ),
    confirmPayment: () => selectedDealAction(
      confirmContactPayment,
      "Оплата подтверждена, контакты открыты",
    ),
    rejectPayment: (reason: string) => selectedDealAction(
      (dealId) => rejectContactPayment(dealId, reason),
      "Чек отклонен",
    ),
  };
}
