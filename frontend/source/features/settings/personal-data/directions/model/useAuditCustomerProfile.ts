"use client";

import { useEffect, useReducer, useState } from "react";
import { fetchAuditCustomerProfile, saveAuditCustomerProfile, type AuditCustomerProfile } from "@/source/entities/directions/audit";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { INITIAL_STATUS, statusReducer } from "./status";

/** Анкета заказчика «Аудит СУПБ»: загрузка, правка и сохранение. */
export function useAuditCustomerProfile() {
  const { showError, showSuccess } = useNotifications();
  const [profile, setProfile] = useState<AuditCustomerProfile | null>(null);
  const [status, dispatch] = useReducer(statusReducer, INITIAL_STATUS);

  useEffect(() => {
    fetchAuditCustomerProfile()
      .then(setProfile)
      .catch(() => dispatch({ type: "load/error", error: "Не удалось загрузить анкету «Аудит СУПБ»" }));
  }, []);

  const save = async () => {
    if (!profile) return;
    dispatch({ type: "save/start" });
    try {
      setProfile(await saveAuditCustomerProfile(profile));
      showSuccess("Анкета сохранена");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось сохранить анкету");
    } finally {
      dispatch({ type: "save/finish" });
    }
  };

  return { profile, ...status, change: setProfile, save };
}
