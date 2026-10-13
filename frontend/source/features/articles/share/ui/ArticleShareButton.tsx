"use client";

import Button from "@/source/shared/ui/Button";
import { useNotifications } from "@/source/shared/ui/Notifications";
import s from "./ArticleShareButton.module.scss";

interface ArticleShareButtonProps {
  url: string;
}

/** Копирует публичную ссылку на статью в буфер обмена. */
export function ArticleShareButton({ url }: ArticleShareButtonProps) {
  const { showSuccess, showError } = useNotifications();

  const share = async () => {
    try {
      await navigator.clipboard.writeText(url);
      showSuccess("Ссылка успешно скопирована");
    } catch {
      showError("Не удалось скопировать ссылку");
    }
  };

  return (
    <div className={s.row}>
      <Button type="button" variant="outline" size="sm" className={s.button} onClick={share}>
        Поделиться
      </Button>
    </div>
  );
}
