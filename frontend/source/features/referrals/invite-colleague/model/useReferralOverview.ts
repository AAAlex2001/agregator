"use client";

import { useEffect, useReducer } from "react";
import { fetchReferralOverview } from "@/source/entities/referral";
import { initialReferralState, referralReducer } from "./reducer";

/** Загружает данные кабинета, отменяет запрос при уходе и поддерживает повтор загрузки. */
export function useReferralOverview() {
  const [state, dispatch] = useReducer(referralReducer, initialReferralState);

  useEffect(() => {
    const controller = new AbortController();

    async function loadOverview(): Promise<void> {
      try {
        const overview = await fetchReferralOverview(controller.signal);
        if (!controller.signal.aborted) dispatch({ type: "LOAD_SUCCEEDED", overview });
      } catch (reason) {
        if (!controller.signal.aborted) {
          dispatch({
            type: "LOAD_FAILED",
            error: reason instanceof Error ? reason.message : "Не удалось загрузить приглашения",
          });
        }
      }
    }

    void loadOverview();
    return () => controller.abort();
  }, [state.requestNumber]);

  function reload(): void {
    dispatch({ type: "LOAD_REQUESTED" });
  }

  return { overview: state.overview, error: state.error, isLoading: state.isLoading, reload };
}
