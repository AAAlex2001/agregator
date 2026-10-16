"use client";

import { useEffect, useState } from "react";
import { getAuditOptions } from "../api/get-audit-options";
import type { AuditOptions } from "./types";

/** Справочники аудита и состояние их загрузки. */
interface AuditOptionsState {
  options: AuditOptions;
  isLoading: boolean;
  error: string | null;
}

/** Загружает справочники аудита, сохраняя их при временном отключении блока. */
export function useAuditOptions(isEnabled = true): AuditOptionsState {
  const [state, setState] = useState<AuditOptionsState>({
    options: {
      industrialSafetyAreas: [],
      expertAttestationAreas: [],
      auditQualifications: [],
      accreditationAreas: [],
      auditAreas: [],
    },
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    let isActive = true;

    getAuditOptions()
      .then((options) => {
        if (isActive) {
          setState({
            options,
            isLoading: false,
            error: null,
          });
        }
      })
      .catch((error) => {
        if (isActive) {
          setState((current) => ({
            ...current,
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "Не удалось загрузить справочники аудита",
          }));
        }
      });

    return () => {
      isActive = false;
    };
  }, [isEnabled]);

  return state;
}
