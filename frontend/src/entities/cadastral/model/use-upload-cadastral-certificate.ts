"use client";

import { useNotifications } from "@/shared/ui/notifications";
import { uploadCadastralCertificate } from "../api/upload-cadastral-certificate";
import { useCadastralProfileContext } from "./profile-provider";

/** Заменяет квалификационный аттестат инженера без потери полей анкеты. */
export function useUploadCadastralCertificate() {
  const { state, dispatch } = useCadastralProfileContext();
  const { showError } = useNotifications();

  /** Обновляет сохранённые файлы после загрузки нового аттестата. */
  async function uploadCertificate(file: File) {
    if (state.operation !== "idle") {
      return;
    }

    dispatch({
      type: "upload/started",
    });

    try {
      const profile = await uploadCadastralCertificate(file);

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

  return uploadCertificate;
}
