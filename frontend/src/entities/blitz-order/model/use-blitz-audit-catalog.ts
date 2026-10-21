"use client";

import { useEffect, useState } from "react";
import { getBlitzAuditCatalog } from "../api/get-blitz-audit-catalog";
import type { BlitzAuditCatalog } from "./audit-types";

/** Справочник аудита и ошибка его загрузки. */
interface BlitzAuditCatalogState {
  catalog: BlitzAuditCatalog | null;
  error: string | null;
}

/** Загружает справочники анкеты аудита и перечень документов. */
export function useBlitzAuditCatalog() {
  const [state, setState] = useState<BlitzAuditCatalogState>({ catalog: null, error: null });

  useEffect(() => {
    let isActive = true;

    getBlitzAuditCatalog()
      .then((catalog) => {
        if (isActive) {
          setState({ catalog, error: null });
        }
      })
      .catch((error) => {
        if (isActive) {
          const message = error instanceof Error ? error.message : null;

          setState({ catalog: null, error: message ?? "Не удалось загрузить справочник аудита" });
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return state;
}