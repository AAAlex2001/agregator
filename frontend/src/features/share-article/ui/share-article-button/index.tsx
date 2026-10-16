"use client";

import { Button } from "@/shared/ui/button";
import { useNotifications } from "@/shared/ui/notifications";
import styles from "./style.module.scss";

/** Публичный адрес статьи, которым можно поделиться. */
interface ShareArticleButtonProps {
  url: string;
}

/** Копирует ссылку на статью и сообщает результат посетителю. */
export function ShareArticleButton({ url }: ShareArticleButtonProps) {
  const { showSuccess, showError } = useNotifications();

  /** Записывает публичный адрес в буфер обмена браузера. */
  async function shareArticle() {
    try {
      await navigator.clipboard.writeText(url);
      showSuccess("Ссылка успешно скопирована");
    } catch {
      showError("Не удалось скопировать ссылку");
    }
  }

  return (
    <div className={styles.row}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={styles.button}
        onClick={shareArticle}
      >
        Поделиться
      </Button>
    </div>
  );
}
