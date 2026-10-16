"use client";

import { useNotifications } from "@/shared/ui/notifications";
import { deleteEcologyDocument } from "../api/delete-ecology-document";
import { useEcologyProfileContext } from "./profile-provider";

/** Удаляет документ и применяет оставшийся список файлов. */
export function useDeleteEcologyDocument() {
  const { state, dispatch } = useEcologyProfileContext();
  const { showError } = useNotifications();

  /** Отправляет исходный адрес документа, полученный от API. */
  async function removeDocument(url: string) {
    if (state.operation !== "idle") {
      return;
    }

    dispatch({
      type: "delete/started",
    });

    try {
      const profile = await deleteEcologyDocument(url);

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
