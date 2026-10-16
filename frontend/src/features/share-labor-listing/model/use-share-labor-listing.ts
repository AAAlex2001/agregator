"use client";

import { SITE_URL } from "@/shared/config/site";
import { useNotifications } from "@/shared/ui/notifications";

/** Копирует публичную ссылку объявления и сообщает результат пользователю. */
export function useShareLaborListing() {
  const { showSuccess, showError } = useNotifications();

  /** Записывает ссылку в буфер обмена после нажатия кнопки. */
  function shareListing(publicId: string) {
    navigator.clipboard
      .writeText(`${SITE_URL}/labor/listing/${publicId}`)
      .then(() => showSuccess("Ссылка на заявку скопирована"))
      .catch(() => showError("Не удалось скопировать ссылку"));
  }

  return shareListing;
}
