"use client";

import { useEffect, useReducer, useState } from "react";
import {
  emptyResearchCatalogs,
  fetchResearchCatalogs,
  fetchResearchProfile,
  saveResearchProfile,
  type ResearchProfile,
} from "@/source/entities/directions/research";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { INITIAL_STATUS, statusReducer } from "./status";

/** Анкета «Научно-исследовательские работы»: справочники, загрузка, правка и сохранение. */
export function useResearchProfile() {
  const { showError, showSuccess } = useNotifications();
  const [profile, setProfile] = useState<ResearchProfile | null>(null);
  const [status, dispatch] = useReducer(statusReducer, INITIAL_STATUS);
  const [catalogs, setCatalogs] = useState(emptyResearchCatalogs);

  useEffect(() => {
    fetchResearchCatalogs().then(setCatalogs).catch(() => undefined);
    fetchResearchProfile()
      .then(setProfile)
      .catch(() => dispatch({ type: "load/error", error: "Не удалось загрузить анкету «Научно-исследовательские работы»" }));
  }, []);

  const save = async () => {
    if (!profile) return;
    dispatch({ type: "save/start" });
    try {
      setProfile(await saveResearchProfile(profile));
      showSuccess("Анкета сохранена");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось сохранить анкету");
    } finally {
      dispatch({ type: "save/finish" });
    }
  };

  return { profile, ...status, catalogs, change: setProfile, save };
}
