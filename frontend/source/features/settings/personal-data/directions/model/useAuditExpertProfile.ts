"use client";

import { useEffect, useReducer, useState } from "react";
import {
  deleteAuditDocument,
  emptyAuditCatalogs,
  fetchAuditCatalogs,
  fetchAuditExpertProfile,
  saveAuditExpertProfile,
  uploadAuditDocument,
  type AuditExpertProfile,
} from "@/source/entities/directions/audit";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { INITIAL_STATUS, statusReducer } from "./status";

/** Анкета исполнителя «Аудит СУПБ»: справочники, правка, сохранение и документы (загружаются сразу). */
export function useAuditExpertProfile() {
  const { showError, showSuccess } = useNotifications();
  const [profile, setProfile] = useState<AuditExpertProfile | null>(null);
  const [status, dispatch] = useReducer(statusReducer, INITIAL_STATUS);
  const [catalogs, setCatalogs] = useState(emptyAuditCatalogs);

  useEffect(() => {
    fetchAuditCatalogs().then(setCatalogs).catch(() => undefined);
    fetchAuditExpertProfile()
      .then(setProfile)
      .catch(() => dispatch({ type: "load/error", error: "Не удалось загрузить анкету «Аудит СУПБ»" }));
  }, []);

  const save = async () => {
    if (!profile) return;
    dispatch({ type: "save/start" });
    try {
      setProfile(await saveAuditExpertProfile(profile));
      showSuccess("Анкета сохранена");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось сохранить анкету");
    } finally {
      dispatch({ type: "save/finish" });
    }
  };

  const updateDocuments = async (request: () => Promise<AuditExpertProfile>) => {
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
      for (const file of files) await uploadAuditDocument(file);
      return fetchAuditExpertProfile();
    });

  const removeDocument = (url: string) => updateDocuments(() => deleteAuditDocument(url));

  return { profile, ...status, catalogs, change: setProfile, save, uploadDocuments, removeDocument };
}
