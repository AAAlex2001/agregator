"use client";

import { useNotifications } from "@/shared/ui/notifications";
import { deleteTechDiagDocument } from "../api/delete-tech-diag-document";
import { useTechDiagProfileContext } from "./profile-provider";

/** Удаляет квалификационное удостоверение специалиста НК. */
export function useDeleteTechDiagDocument() {
  const { state, dispatch } = useTechDiagProfileContext();
  const { showError } = useNotifications();

  /** Передаёт исходный адрес файла и применяет подтверждённый список документов. */
  async function removeDocument(url: string) {
    if (state.operation !== "idle") {
      return;
    }

    dispatch({
      type: "delete/started",
    });

    try {
      const profile = await deleteTechDiagDocument(url);

      dispatch({
        type: "documents/updated",
        documents: profile.documents,
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
