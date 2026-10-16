"use client";

import { useEffect, useState } from "react";
import { getAuditHolderProfile } from "../api/get-audit-holder-profile";
import { getAuditOptions } from "../api/get-audit-options";
import type { AuditHolderProfileValues, AuditOptions } from "./types";

/** Анкета инспекционного органа, справочники и состояние их загрузки. */
interface AuditHolderProfileState {
  profile: AuditHolderProfileValues | null;
  options: AuditOptions | null;
  isLoading: boolean;
  error: string | null;
}

/** Загружает анкету инспекционного органа и справочники аудита для редактирования. */
export function useLoadAuditHolderProfile(): AuditHolderProfileState {
  const [state, setState] = useState<AuditHolderProfileState>({
    profile: null,
    options: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isActive = true;

    Promise.all([getAuditHolderProfile(), getAuditOptions()])
      .then(([profile, options]) => {
        if (isActive) {
          setState({ profile, options, isLoading: false, error: null });
        }
      })
      .catch((error) => {
        if (isActive) {
          setState({
            profile: null,
            options: null,
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "Не удалось загрузить анкету «Аудит СУПБ»",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return state;
}
