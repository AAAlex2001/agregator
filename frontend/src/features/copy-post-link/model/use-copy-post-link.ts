"use client";

import { useNotifications } from "@/shared/ui/notifications";

/** Копирует в буфер обмена адрес публикации на сайте. */
export function useCopyPostLink(postId: number) {
  const { showSuccess, showError } = useNotifications();

  /** Сообщает, удалось ли записать ссылку в буфер обмена. */
  function copyLink() {
    const url = `${window.location.origin}/posts/${postId}`;

    navigator.clipboard.writeText(url).then(
      () => showSuccess("Ссылка скопирована"),
      () => showError("Не удалось скопировать ссылку"),
    );
  }

  return copyLink;
}
