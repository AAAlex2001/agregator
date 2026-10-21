"use client";

import { useEffect, useState } from "react";
import { getBlitzCatalog } from "../api/get-blitz-catalog";
import type { BlitzCatalog } from "./types";

/** Справочник и ошибка его загрузки. */
interface BlitzCatalogState {
  catalog: BlitzCatalog | null;
  error: string | null;
}

/** Загружает справочник областей, объектов, видов договора и сроков. */
export function useBlitzCatalog() {
  const [state, setState] = useState<BlitzCatalogState>({ catalog: null, error: null });

  useEffect(() => {
    let isActive = true;

    getBlitzCatalog()
      .then((catalog) => {
        if (isActive) {
          setState({ catalog, error: null });
        }
      })
      .catch((error) => {
        if (isActive) {
          setState({
            catalog: null,
            error: error instanceof Error ? error.message : "Не удалось загрузить справочник",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return state;
}
