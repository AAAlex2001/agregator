"use client";

import { useNotifications } from "@/shared/ui/notifications";
import { deleteSroDocument } from "../api/delete-sro-document";
import { useSroProfileContext } from "./profile-provider";

/** Удаляет дополнительный документ члена СРО. */
export function useDeleteSroDocument() {
  const { direction, state, dispatch } = useSroProfileContext();
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
      const profile = await deleteSroDocument(direction, url);

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
