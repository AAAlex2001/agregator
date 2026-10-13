"use client";

import { useEffect, useReducer, useState } from "react";
import {
  deleteEcologyDocument,
  emptyEcologyCatalogs,
  fetchEcologyCatalogs,
  fetchEcologyProfile,
  saveEcologyProfile,
  uploadEcologyDocument,
  type EcologyProfile,
} from "@/source/entities/directions/ecology";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { INITIAL_STATUS, statusReducer } from "./status";

/** Анкета «Экологическое сопровождение предприятий»: справочники, правка, сохранение и документы. */
export function useEcologyProfile() {
  const { showError, showSuccess } = useNotifications();
  const [profile, setProfile] = useState<EcologyProfile | null>(null);
  const [status, dispatch] = useReducer(statusReducer, INITIAL_STATUS);
  const [catalogs, setCatalogs] = useState(emptyEcologyCatalogs);

  useEffect(() => {
    fetchEcologyCatalogs().then(setCatalogs).catch(() => undefined);
    fetchEcologyProfile()
      .then(setProfile)
      .catch(() => dispatch({ type: "load/error", error: "Не удалось загрузить анкету «Экологическое сопровождение предприятий»" }));
  }, []);

  const save = async () => {
    if (!profile) return;
    dispatch({ type: "save/start" });
    try {
      setProfile(await saveEcologyProfile(profile));
      showSuccess("Анкета сохранена");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось сохранить анкету");
    } finally {
      dispatch({ type: "save/finish" });
    }
  };

  const updateDocuments = async (request: () => Promise<EcologyProfile>) => {
    dispatch({ type: "upload/start" });
    try {
      const server = await request();
      setProfile((current) => current && { ...current, documents: server.documents });
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось обновить документы");
    } finally {
      dispatch({ type: "upload/finish" });
    }
  };

  const uploadDocuments = (files: File[]) =>
    updateDocuments(async () => {
      for (const file of files) await uploadEcologyDocument(file);
      return fetchEcologyProfile();
    });

  const removeDocument = (url: string) => updateDocuments(() => deleteEcologyDocument(url));

  return { profile, ...status, catalogs, change: setProfile, save, uploadDocuments, removeDocument };
}
