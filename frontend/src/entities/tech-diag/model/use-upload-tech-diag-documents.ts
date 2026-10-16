"use client";

import { useNotifications } from "@/shared/ui/notifications";
import { uploadTechDiagDocument } from "../api/upload-tech-diag-document";
import { useTechDiagProfileContext } from "./profile-provider";

/** Последовательно загружает квалификационные удостоверения специалиста НК. */
export function useUploadTechDiagDocuments() {
  const { state, dispatch } = useTechDiagProfileContext();
  const { showError } = useNotifications();

  /** Сохраняет каждый принятый файл, даже если следующий загрузить не удалось. */
  async function uploadDocuments(files: File[]) {
    if (state.operation !== "idle" || files.length === 0) {
      return;
    }

    dispatch({
      type: "upload/started",
    });

    try {
      for (const file of files) {
        const profile = await uploadTechDiagDocument(file);

        dispatch({
          type: "documents/updated",
          documents: profile.documents,
        });
      }
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Не удалось обновить документы",
      );
    } finally {
      dispatch({
        type: "request/finished",
      });
    }
  }

  return uploadDocuments;
}
