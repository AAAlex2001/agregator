"use client";

import { useEffect, useReducer, useState } from "react";
import {
  deleteForensicDocument,
  fetchForensicProfile,
  saveForensicProfile,
  uploadForensicDiploma,
  uploadForensicDocument,
  type ForensicProfile,
} from "@/source/entities/directions/forensic";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { INITIAL_STATUS, statusReducer } from "./status";

/** Анкета «Судебная экспертиза»: правка, сохранение, диплом и документы (файлы загружаются сразу). */
export function useForensicProfile() {
  const { showError, showSuccess } = useNotifications();
  const [profile, setProfile] = useState<ForensicProfile | null>(null);
  const [status, dispatch] = useReducer(statusReducer, INITIAL_STATUS);

  useEffect(() => {
    fetchForensicProfile()
      .then(setProfile)
      .catch(() => dispatch({ type: "load/error", error: "Не удалось загрузить анкету «Судебная экспертиза»" }));
  }, []);

  const save = async () => {
    if (!profile) return;
    dispatch({ type: "save/start" });
    try {
      setProfile(await saveForensicProfile(profile));
      showSuccess("Анкета сохранена");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось сохранить анкету");
    } finally {
      dispatch({ type: "save/finish" });
    }
  };

  const updateFiles = async (request: () => Promise<ForensicProfile>) => {
    dispatch({ type: "upload/start" });
    try {
      const server = await request();
      setProfile(
        (current) =>
          current && { ...current, education_diploma: server.education_diploma, documents: server.documents },
      );
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось обновить файлы");
    } finally {
      dispatch({ type: "upload/finish" });
    }
  };

  const uploadDiploma = (file: File) => updateFiles(() => uploadForensicDiploma(file));

  const uploadDocuments = (files: File[]) =>
    updateFiles(async () => {
      for (const file of files) await uploadForensicDocument(file);
      return fetchForensicProfile();
    });

  const removeDocument = (url: string) => updateFiles(() => deleteForensicDocument(url));

  return { profile, ...status, change: setProfile, save, uploadDiploma, uploadDocuments, removeDocument };
}
