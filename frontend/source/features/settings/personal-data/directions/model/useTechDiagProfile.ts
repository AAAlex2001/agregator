"use client";

import { useEffect, useReducer, useState } from "react";
import {
  deleteTechDiagDocument,
  emptyTechDiagCatalogs,
  fetchTechDiagCatalogs,
  fetchTechDiagProfile,
  saveTechDiagProfile,
  uploadTechDiagDocument,
  type TechDiagProfile,
} from "@/source/entities/directions/tech-diag";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { INITIAL_STATUS, statusReducer } from "./status";

/** Анкета «Техническое освидетельствование и диагностирование»: справочники, правка, сохранение и удостоверения. */
export function useTechDiagProfile() {
  const { showError, showSuccess } = useNotifications();
  const [profile, setProfile] = useState<TechDiagProfile | null>(null);
  const [status, dispatch] = useReducer(statusReducer, INITIAL_STATUS);
  const [catalogs, setCatalogs] = useState(emptyTechDiagCatalogs);

  useEffect(() => {
    fetchTechDiagCatalogs().then(setCatalogs).catch(() => undefined);
    fetchTechDiagProfile()
      .then(setProfile)
      .catch(() => dispatch({ type: "load/error", error: "Не удалось загрузить анкету «Техническое освидетельствование и диагностирование»" }));
  }, []);

  const save = async () => {
    if (!profile) return;
    dispatch({ type: "save/start" });
    try {
      setProfile(await saveTechDiagProfile(profile));
      showSuccess("Анкета сохранена");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось сохранить анкету");
    } finally {
      dispatch({ type: "save/finish" });
    }
  };

  const updateDocuments = async (request: () => Promise<TechDiagProfile>) => {
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
      for (const file of files) await uploadTechDiagDocument(file);
      return fetchTechDiagProfile();
    });

  const removeDocument = (url: string) => updateDocuments(() => deleteTechDiagDocument(url));

  return { profile, ...status, catalogs, change: setProfile, save, uploadDocuments, removeDocument };
}
