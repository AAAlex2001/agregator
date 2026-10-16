"use client";

import { useNotifications } from "@/shared/ui/notifications";
import { deleteDesignDocument } from "../api/delete-design-document";
import { useDesignProfileContext } from "./profile-provider";
import type { DesignDocumentGroup } from "./types";

/** Удаляет файл из выбранной группы документов проектировщика. */
export function useDeleteDesignDocument() {
  const { state, dispatch } = useDesignProfileContext();
  const { showError } = useNotifications();

  /** Передаёт исходный адрес файла и применяет подтверждённые списки документов. */
  async function removeDocument(group: DesignDocumentGroup, url: string) {
    if (state.operation !== "idle") {
      return;
    }

    dispatch({
      type: "delete/started",
    });

    try {
      const profile = await deleteDesignDocument(group, url);

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
