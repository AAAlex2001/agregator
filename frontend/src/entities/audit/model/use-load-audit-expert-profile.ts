"use client";

import { useEffect, useState } from "react";
import { getAuditExpertProfile } from "../api/get-audit-expert-profile";
import { getAuditOptions } from "../api/get-audit-options";
import type { AuditExpertProfile, AuditOptions } from "./types";

/** Анкета аудитора, справочники и состояние их загрузки. */
interface AuditExpertProfileState {
  profile: AuditExpertProfile | null;
  options: AuditOptions | null;
  isLoading: boolean;
  error: string | null;
}

/** Загружает анкету аудитора и справочники аудита для её редактирования. */
export function useLoadAuditExpertProfile(): AuditExpertProfileState {
  const [state, setState] = useState<AuditExpertProfileState>({
    profile: null,
    options: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isActive = true;

    Promise.all([getAuditExpertProfile(), getAuditOptions()])
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
