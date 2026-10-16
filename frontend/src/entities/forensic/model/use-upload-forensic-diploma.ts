"use client";

import { useNotifications } from "@/shared/ui/notifications";
import { uploadForensicDiploma } from "../api/upload-forensic-diploma";
import { useForensicProfileContext } from "./profile-provider";

/** Заменяет диплом судебного эксперта, сохраняя поля анкеты. */
export function useUploadForensicDiploma() {
  const { state, dispatch } = useForensicProfileContext();
  const { showError } = useNotifications();

  /** Применяет файловую часть ответа после загрузки диплома. */
  async function uploadDiploma(file: File) {
    if (state.operation !== "idle") {
      return;
    }

    dispatch({
      type: "upload/started",
    });

    try {
      const profile = await uploadForensicDiploma(file);

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
