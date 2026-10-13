"use client";

import { useEffect, useReducer, useState } from "react";
import { fetchExpertiseProfile, saveExpertiseProfile, type ExpertiseProfile } from "@/source/entities/directions/expertise";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { INITIAL_STATUS, statusReducer } from "./status";

/** Анкета «Экспертиза промышленной безопасности»: загрузка, правка и сохранение. */
export function useExpertiseProfile() {
  const { showError, showSuccess } = useNotifications();
  const [profile, setProfile] = useState<ExpertiseProfile | null>(null);
  const [status, dispatch] = useReducer(statusReducer, INITIAL_STATUS);

  useEffect(() => {
    fetchExpertiseProfile()
      .then(setProfile)
      .catch(() => dispatch({ type: "load/error", error: "Не удалось загрузить анкету «Экспертиза промышленной безопасности»" }));
  }, []);

  const save = async () => {
    if (!profile) return;
    dispatch({ type: "save/start" });
    try {
      setProfile(await saveExpertiseProfile(profile));
      showSuccess("Анкета сохранена");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось сохранить анкету");
    } finally {
      dispatch({ type: "save/finish" });
    }
  };

  return { profile, ...status, change: setProfile, save };
}
