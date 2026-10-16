"use client";

import { useEffect, useReducer } from "react";
import { getReferralOverview } from "../api/get-referral-overview";
import { INITIAL_REFERRAL_STATE, referralReducer } from "./reducer";

/** Загружает статистику приглашений и позволяет повторить неудачный запрос. */
export function useReferralOverview() {
  const [state, dispatch] = useReducer(referralReducer, INITIAL_REFERRAL_STATE);

  useEffect(() => {
    let isActive = true;

    getReferralOverview()
      .then((overview) => {
        if (isActive) {
          dispatch({
            type: "load/success",
            overview,
          });
        }
      })
      .catch((error) => {
        if (isActive) {
          dispatch({
            type: "load/error",
            error: error instanceof Error
              ? error.message
              : "Не удалось загрузить приглашения",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [state.attempt]);

  /** Запускает следующую попытку загрузки статистики. */
  function retry() {
    dispatch({ type: "load/retry" });
  }

  return {
    state,
    retry,
  };
}
