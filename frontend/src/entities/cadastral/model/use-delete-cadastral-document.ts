"use client";

import { useNotifications } from "@/shared/ui/notifications";
import { deleteCadastralDocument } from "../api/delete-cadastral-document";
import { useCadastralProfileContext } from "./profile-provider";

/** Удаляет дополнительный документ из сохранённой анкеты инженера. */
export function useDeleteCadastralDocument() {
  const { state, dispatch } = useCadastralProfileContext();
  const { showError } = useNotifications();

  /** Передаёт исходный адрес файла и обновляет подтверждённый список. */
  async function removeDocument(url: string) {
    if (state.operation !== "idle") {
      return;
    }

    dispatch({
      type: "delete/started",
    });

    try {
      const profile = await deleteCadastralDocument(url);

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
