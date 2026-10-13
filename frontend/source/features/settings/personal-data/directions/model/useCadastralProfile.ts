"use client";

import { useEffect, useReducer, useState } from "react";
import {
  deleteCadastralDocument,
  fetchCadastralProfile,
  saveCadastralProfile,
  uploadCadastralCertificate,
  uploadCadastralDiploma,
  uploadCadastralDocument,
  type CadastralProfile,
} from "@/source/entities/directions/cadastral";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { INITIAL_STATUS, statusReducer } from "./status";

/** Анкета «Кадастровые работы»: правка, сохранение, диплом, аттестат и документы (файлы загружаются сразу). */
export function useCadastralProfile() {
  const { showError, showSuccess } = useNotifications();
  const [profile, setProfile] = useState<CadastralProfile | null>(null);
  const [status, dispatch] = useReducer(statusReducer, INITIAL_STATUS);

  useEffect(() => {
    fetchCadastralProfile()
      .then(setProfile)
      .catch(() => dispatch({ type: "load/error", error: "Не удалось загрузить анкету «Кадастровые работы»" }));
  }, []);

  const save = async () => {
    if (!profile) return;
    dispatch({ type: "save/start" });
    try {
      setProfile(await saveCadastralProfile(profile));
      showSuccess("Анкета сохранена");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось сохранить анкету");
    } finally {
      dispatch({ type: "save/finish" });
    }
  };

  const updateFiles = async (request: () => Promise<CadastralProfile>) => {
    dispatch({ type: "upload/start" });
    try {
      const server = await request();
      setProfile(
        (current) =>
          current && {
            ...current,
            education_diploma: server.education_diploma,
            certificate_file: server.certificate_file,
            documents: server.documents,
          },
      );
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось обновить файлы");
    } finally {
      dispatch({ type: "upload/finish" });
    }
  };

  const uploadDiploma = (file: File) => updateFiles(() => uploadCadastralDiploma(file));

  const uploadCertificate = (file: File) => updateFiles(() => uploadCadastralCertificate(file));

  const uploadDocuments = (files: File[]) =>
    updateFiles(async () => {
      for (const file of files) await uploadCadastralDocument(file);
      return fetchCadastralProfile();
    });

  const removeDocument = (url: string) => updateFiles(() => deleteCadastralDocument(url));

  return {
    profile,
    ...status,
    change: setProfile,
    save,
    uploadDiploma,
    uploadCertificate,
    uploadDocuments,
    removeDocument,
  };
}
