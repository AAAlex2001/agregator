"use client";

import { useEffect, useReducer } from "react";
import { fetchReferralOverview } from "@/source/entities/referral";
import { INITIAL_STATE, referralReducer } from "./reducer";

/** Данные кабинета приглашений. «Попробовать ещё раз» увеличивает номер попытки — эффект загружает заново. */
export function useReferralOverview() {
  const [state, dispatch] = useReducer(referralReducer, INITIAL_STATE);

  useEffect(() => {
    let cancelled = false;
    fetchReferralOverview()
      .then((overview) => {
        if (!cancelled) dispatch({ type: "load/success", overview });
      })
      .catch((error) => {
        if (!cancelled) {
          dispatch({ type: "load/error", error: error instanceof Error ? error.message : "Не удалось загрузить приглашения" });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [state.attempt]);

  return { state, retry: () => dispatch({ type: "load/retry" }) };
}
