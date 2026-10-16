"use client";

import { useNotifications } from "@/shared/ui/notifications";
import { uploadSurveyDocument } from "../api/upload-survey-document";
import { useSurveyProfileContext } from "./profile-provider";
import type { SurveyDocumentGroup } from "./types";

/** Загружает файлы в выбранную группу подтверждающих документов изыскателя. */
export function useUploadSurveyDocuments() {
  const { state, dispatch } = useSurveyProfileContext();
  const { showError } = useNotifications();

  /** Сохраняет каждый принятый файл, даже если следующий загрузить не удалось. */
  async function uploadDocuments(group: SurveyDocumentGroup, files: File[]) {
    if (state.operation !== "idle" || files.length === 0) {
      return;
    }

    dispatch({
      type: "upload/started",
    });

    try {
      for (const file of files) {
        const profile = await uploadSurveyDocument(group, file);

        dispatch({
          type: "documents/updated",
          documents: profile,
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
