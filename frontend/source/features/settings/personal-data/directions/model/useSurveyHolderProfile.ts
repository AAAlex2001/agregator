"use client";

import { useEffect, useReducer, useState } from "react";
import {
  deleteSurveyHolderDocument,
  fetchSurveyHolderProfile,
  saveSurveyHolderProfile,
  uploadSurveyHolderDocument,
} from "@/source/entities/directions/survey";
import type { SroHolderProfile } from "@/source/entities/directions/shared";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { INITIAL_STATUS, statusReducer } from "./status";

/** Анкета держателя документов «СРО изыскателей»: правка, сохранение и дополнительные документы. */
export function useSurveyHolderProfile() {
  const { showError, showSuccess } = useNotifications();
  const [profile, setProfile] = useState<SroHolderProfile | null>(null);
  const [status, dispatch] = useReducer(statusReducer, INITIAL_STATUS);

  useEffect(() => {
    fetchSurveyHolderProfile()
      .then(setProfile)
      .catch(() => dispatch({ type: "load/error", error: "Не удалось загрузить анкету «СРО изыскателей»" }));
  }, []);

  const save = async () => {
    if (!profile) return;
    dispatch({ type: "save/start" });
    try {
      setProfile(await saveSurveyHolderProfile(profile));
      showSuccess("Анкета сохранена");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось сохранить анкету");
    } finally {
      dispatch({ type: "save/finish" });
    }
  };

  const updateDocuments = async (request: () => Promise<SroHolderProfile>) => {
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
      for (const file of files) await uploadSurveyHolderDocument(file);
      return fetchSurveyHolderProfile();
    });

  const removeDocument = (url: string) => updateDocuments(() => deleteSurveyHolderDocument(url));

  return { profile, ...status, change: setProfile, save, uploadDocuments, removeDocument };
}
