"use client";

import { useEffect, useReducer, useState } from "react";
import {
  deleteSurveyDocument,
  emptySurveyCatalogs,
  fetchSurveyCatalogs,
  fetchSurveyProfile,
  saveSurveyProfile,
  uploadSurveyDocument,
  type SurveyDocumentGroup,
  type SurveyProfile,
} from "@/source/entities/directions/survey";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { INITIAL_STATUS, statusReducer } from "./status";

/** Анкета «Инженерные изыскания»: справочники, правка, сохранение и пять групп документов (загружаются сразу). */
export function useSurveyProfile() {
  const { showError, showSuccess } = useNotifications();
  const [profile, setProfile] = useState<SurveyProfile | null>(null);
  const [status, dispatch] = useReducer(statusReducer, INITIAL_STATUS);
  const [catalogs, setCatalogs] = useState(emptySurveyCatalogs);

  useEffect(() => {
    fetchSurveyCatalogs().then(setCatalogs).catch(() => undefined);
    fetchSurveyProfile()
      .then(setProfile)
      .catch(() => dispatch({ type: "load/error", error: "Не удалось загрузить анкету «Инженерные изыскания»" }));
  }, []);

  const save = async () => {
    if (!profile) return;
    dispatch({ type: "save/start" });
    try {
      setProfile(await saveSurveyProfile(profile));
      showSuccess("Анкета сохранена");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось сохранить анкету");
    } finally {
      dispatch({ type: "save/finish" });
    }
  };

  const updateDocuments = async (request: () => Promise<SurveyProfile>) => {
    dispatch({ type: "upload/start" });
    try {
      const server = await request();
      setProfile(
        (current) =>
          current && {
            ...current,
            education_documents: server.education_documents,
            nok_documents: server.nok_documents,
            nrs_documents: server.nrs_documents,
            qualification_documents: server.qualification_documents,
            rtn_documents: server.rtn_documents,
          },
      );
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось обновить документы");
    } finally {
      dispatch({ type: "upload/finish" });
    }
  };

  const uploadDocuments = (group: SurveyDocumentGroup, files: File[]) =>
    updateDocuments(async () => {
      for (const file of files) await uploadSurveyDocument(group, file);
      return fetchSurveyProfile();
    });

  const removeDocument = (group: SurveyDocumentGroup, url: string) =>
    updateDocuments(() => deleteSurveyDocument(group, url));

  return { profile, ...status, catalogs, change: setProfile, save, uploadDocuments, removeDocument };
}
