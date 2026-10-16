"use client";

import { useNotifications } from "@/shared/ui/notifications";
import { deleteForensicDocument } from "../api/delete-forensic-document";
import { useForensicProfileContext } from "./profile-provider";

/** Удаляет документ о дополнительном образовании судебного эксперта. */
export function useDeleteForensicDocument() {
  const { state, dispatch } = useForensicProfileContext();
  const { showError } = useNotifications();

  /** Передаёт исходный адрес файла и применяет подтверждённый список. */
  async function removeDocument(url: string) {
    if (state.operation !== "idle") {
      return;
    }

    dispatch({
      type: "delete/started",
    });

    try {
      const profile = await deleteForensicDocument(url);

      dispatch({
        type: "files/updated",
        profile,
      });
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Не удалось обновить файлы",
      );
    } finally {
      dispatch({
        type: "request/finished",
      });
    }
  }

  return removeDocument;
}
