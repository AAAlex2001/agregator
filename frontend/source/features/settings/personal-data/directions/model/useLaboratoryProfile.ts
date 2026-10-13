"use client";

import { useEffect, useReducer, useState } from "react";
import { fetchLaboratoryProfile, saveLaboratoryProfile, type LaboratoryProfile } from "@/source/entities/directions/laboratory";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { INITIAL_STATUS, statusReducer } from "./status";

/** Анкета «Лабораторные исследования»: загрузка, правка и сохранение. */
export function useLaboratoryProfile() {
  const { showError, showSuccess } = useNotifications();
  const [profile, setProfile] = useState<LaboratoryProfile | null>(null);
  const [status, dispatch] = useReducer(statusReducer, INITIAL_STATUS);

  useEffect(() => {
    fetchLaboratoryProfile()
      .then(setProfile)
      .catch(() => dispatch({ type: "load/error", error: "Не удалось загрузить анкету «Лабораторные исследования»" }));
  }, []);

  const save = async () => {
    if (!profile) return;
    dispatch({ type: "save/start" });
    try {
      setProfile(await saveLaboratoryProfile(profile));
      showSuccess("Анкета сохранена");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось сохранить анкету");
    } finally {
      dispatch({ type: "save/finish" });
    }
  };

  return { profile, ...status, change: setProfile, save };
}
