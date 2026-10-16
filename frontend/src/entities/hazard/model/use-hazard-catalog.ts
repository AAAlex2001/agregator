"use client";

import { useEffect, useState } from "react";
import { getHazardCatalog } from "../api/get-hazard-catalog";
import type { HazardCatalog, HazardProfile } from "./types";

/** Справочник последнего завершённого запроса и профиль, для которого он загружен. */
interface HazardCatalogState {
  profile: HazardProfile | null;
  catalog: HazardCatalog | null;
  error: string | null;
}

/** Загружает факторы профиля и загружает их заново при смене рудника на шахту. */
export function useHazardCatalog(profile: HazardProfile) {
  const [state, setState] = useState<HazardCatalogState>({
    profile: null,
    catalog: null,
    error: null,
  });

  useEffect(() => {
    let isActive = true;

    getHazardCatalog(profile)
      .then((catalog) => {
        if (isActive) {
          setState({
            profile,
            catalog,
            error: null,
          });
        }
      })
      .catch((error) => {
        if (isActive) {
          setState({
            profile,
            catalog: null,
            error: error instanceof Error ? error.message : "Не удалось загрузить факторы",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [profile]);

  const isLoading = state.profile !== profile;

  return {
    catalog: isLoading ? null : state.catalog,
    error: isLoading ? null : state.error,
    isLoading,
  };
}
