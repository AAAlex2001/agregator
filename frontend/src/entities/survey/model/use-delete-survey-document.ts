"use client";

import { useNotifications } from "@/shared/ui/notifications";
import { deleteSurveyDocument } from "../api/delete-survey-document";
import { useSurveyProfileContext } from "./profile-provider";
import type { SurveyDocumentGroup } from "./types";

/** Удаляет файл из выбранной группы документов изыскателя. */
export function useDeleteSurveyDocument() {
  const { state, dispatch } = useSurveyProfileContext();
  const { showError } = useNotifications();

  /** Передаёт исходный адрес файла и применяет подтверждённые списки документов. */
  async function removeDocument(group: SurveyDocumentGroup, url: string) {
    if (state.operation !== "idle") {
      return;
    }

    dispatch({
      type: "delete/started",
    });

    try {
      const profile = await deleteSurveyDocument(group, url);

      dispatch({
        type: "documents/updated",
        documents: profile,
      });
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

  return removeDocument;
}
