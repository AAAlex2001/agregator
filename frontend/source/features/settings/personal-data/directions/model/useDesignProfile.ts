"use client";

import { useEffect, useReducer, useState } from "react";
import {
  deleteDesignDocument,
  emptyDesignCatalogs,
  fetchDesignCatalogs,
  fetchDesignProfile,
  saveDesignProfile,
  uploadDesignDocument,
  type DesignDocumentGroup,
  type DesignProfile,
} from "@/source/entities/directions/design";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { INITIAL_STATUS, statusReducer } from "./status";

/** Анкета «Проектирование»: справочники, правка, сохранение и пять групп документов (загружаются сразу). */
export function useDesignProfile() {
  const { showError, showSuccess } = useNotifications();
  const [profile, setProfile] = useState<DesignProfile | null>(null);
  const [status, dispatch] = useReducer(statusReducer, INITIAL_STATUS);
  const [catalogs, setCatalogs] = useState(emptyDesignCatalogs);

  useEffect(() => {
    fetchDesignCatalogs().then(setCatalogs).catch(() => undefined);
    fetchDesignProfile()
      .then(setProfile)
      .catch(() => dispatch({ type: "load/error", error: "Не удалось загрузить анкету «Проектирование»" }));
  }, []);

  const save = async () => {
    if (!profile) return;
    dispatch({ type: "save/start" });
    try {
      setProfile(await saveDesignProfile(profile));
      showSuccess("Анкета сохранена");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось сохранить анкету");
    } finally {
      dispatch({ type: "save/finish" });
    }
  };

  const updateDocuments = async (request: () => Promise<DesignProfile>) => {
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

  const uploadDocuments = (group: DesignDocumentGroup, files: File[]) =>
    updateDocuments(async () => {
      for (const file of files) await uploadDesignDocument(group, file);
      return fetchDesignProfile();
    });

  const removeDocument = (group: DesignDocumentGroup, url: string) =>
    updateDocuments(() => deleteDesignDocument(group, url));

  return { profile, ...status, catalogs, change: setProfile, save, uploadDocuments, removeDocument };
}
