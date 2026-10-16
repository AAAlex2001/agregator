"use client";

import { useNotifications } from "@/shared/ui/notifications";
import { deleteAuditDocument } from "../api/delete-audit-document";
import { useAuditExpertProfileContext } from "./profile-provider";

/** Удаляет подтверждающий документ аудитора. */
export function useDeleteAuditDocument() {
  const { state, dispatch } = useAuditExpertProfileContext();
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
      const profile = await deleteAuditDocument(url);

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
