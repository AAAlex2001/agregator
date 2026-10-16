"use client";

import { useNotifications } from "@/shared/ui/notifications";
import { uploadCadastralDiploma } from "../api/upload-cadastral-diploma";
import { useCadastralProfileContext } from "./profile-provider";

/** Заменяет диплом инженера, сохраняя редактируемые сведения анкеты. */
export function useUploadCadastralDiploma() {
  const { state, dispatch } = useCadastralProfileContext();
  const { showError } = useNotifications();

  /** Применяет только файловую часть ответа после загрузки диплома. */
  async function uploadDiploma(file: File) {
    if (state.operation !== "idle") {
      return;
    }

    dispatch({
      type: "upload/started",
    });

    try {
      const profile = await uploadCadastralDiploma(file);

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

  return uploadDiploma;
}
