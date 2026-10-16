"use client";

import { useEffect, useState } from "react";
import { getAuditCustomerProfile } from "../api/get-audit-customer-profile";
import type { AuditCustomerProfileValues } from "./types";

/** Анкета заказчика аудита и состояние её загрузки. */
interface AuditCustomerProfileState {
  profile: AuditCustomerProfileValues | null;
  isLoading: boolean;
  error: string | null;
}

/** Загружает анкету заказчика аудита СУПБ для её редактирования. */
export function useLoadAuditCustomerProfile(): AuditCustomerProfileState {
  const [state, setState] = useState<AuditCustomerProfileState>({
    profile: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isActive = true;

    getAuditCustomerProfile()
      .then((profile) => {
        if (isActive) {
          setState({ profile, isLoading: false, error: null });
        }
      })
      .catch((error) => {
        if (isActive) {
          setState({
            profile: null,
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
