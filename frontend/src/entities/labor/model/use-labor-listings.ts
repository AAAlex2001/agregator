"use client";

import { useEffect, useState } from "react";
import { getLaborListings } from "../api/get-labor-listings";
import type { LaborListing, LaborListingKind } from "./types";

/** Объявления последнего завершённого запроса и ключ этого запроса. */
interface LaborListingsState {
  requestKey: string;
  items: LaborListing[];
  error: string | null;
}

/** Загружает чужие или свои объявления и перезагружает их после изменений. */
export function useLaborListings(kind: LaborListingKind, mine: boolean) {
  const [version, setVersion] = useState(0);
  const [state, setState] = useState<LaborListingsState>({
    requestKey: "",
    items: [],
    error: null,
  });
  const requestKey = `${kind}-${mine}-${version}`;

  useEffect(() => {
    let isActive = true;

    getLaborListings(kind, mine)
      .then((items) => {
        if (isActive) {
          setState({
            requestKey,
            items,
            error: null,
          });
        }
      })
      .catch((error) => {
        if (isActive) {
          setState({
            requestKey,
            items: [],
            error: error instanceof Error ? error.message : "Не удалось загрузить заявки",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [kind, mine, requestKey]);

  /** Запрашивает список заново, например после публикации или закрытия заявки. */
  function reload() {
    setVersion((current) => current + 1);
  }

  const isLoading = state.requestKey !== requestKey;

  return {
    items: isLoading ? [] : state.items,
    error: isLoading ? null : state.error,
    isLoading,
    reload,
  };
}
