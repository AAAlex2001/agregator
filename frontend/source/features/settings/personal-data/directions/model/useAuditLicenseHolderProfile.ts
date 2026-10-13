"use client";

import { useEffect, useReducer, useState } from "react";
import {
  emptyAuditCatalogs,
  fetchAuditCatalogs,
  fetchAuditLicenseHolderProfile,
  saveAuditLicenseHolderProfile,
  type AuditLicenseHolderProfile,
} from "@/source/entities/directions/audit";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { INITIAL_STATUS, statusReducer } from "./status";

/** Анкета держателя документов «Аудит СУПБ»: справочники, загрузка, правка и сохранение. */
export function useAuditLicenseHolderProfile() {
  const { showError, showSuccess } = useNotifications();
  const [profile, setProfile] = useState<AuditLicenseHolderProfile | null>(null);
  const [status, dispatch] = useReducer(statusReducer, INITIAL_STATUS);
  const [catalogs, setCatalogs] = useState(emptyAuditCatalogs);

  useEffect(() => {
    fetchAuditCatalogs().then(setCatalogs).catch(() => undefined);
    fetchAuditLicenseHolderProfile()
      .then(setProfile)
      .catch(() => dispatch({ type: "load/error", error: "Не удалось загрузить анкету «Аудит СУПБ»" }));
  }, []);

  const save = async () => {
    if (!profile) return;
    dispatch({ type: "save/start" });
    try {
      setProfile(await saveAuditLicenseHolderProfile(profile));
      showSuccess("Анкета сохранена");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось сохранить анкету");
    } finally {
      dispatch({ type: "save/finish" });
    }
  };

  return { profile, ...status, catalogs, change: setProfile, save };
}
