"use client";

import { useEffect, useReducer, useState } from "react";
import {
  emptyTechDiagCatalogs,
  fetchTechDiagCatalogs,
  fetchTechDiagHolderProfile,
  saveTechDiagHolderProfile,
  type TechDiagHolderProfile,
} from "@/source/entities/directions/tech-diag";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { INITIAL_STATUS, statusReducer } from "./status";

/** Анкета лаборатории НК (держатель документов): справочники, загрузка, правка и сохранение. */
export function useTechDiagHolderProfile() {
  const { showError, showSuccess } = useNotifications();
  const [profile, setProfile] = useState<TechDiagHolderProfile | null>(null);
  const [status, dispatch] = useReducer(statusReducer, INITIAL_STATUS);
  const [catalogs, setCatalogs] = useState(emptyTechDiagCatalogs);

  useEffect(() => {
    fetchTechDiagCatalogs().then(setCatalogs).catch(() => undefined);
    fetchTechDiagHolderProfile()
      .then(setProfile)
      .catch(() => dispatch({ type: "load/error", error: "Не удалось загрузить анкету «Лаборатория НК»" }));
  }, []);

  const save = async () => {
    if (!profile) return;
    dispatch({ type: "save/start" });
    try {
      setProfile(await saveTechDiagHolderProfile(profile));
      showSuccess("Анкета сохранена");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось сохранить анкету");
    } finally {
      dispatch({ type: "save/finish" });
    }
  };

  return { profile, ...status, catalogs, change: setProfile, save };
}
