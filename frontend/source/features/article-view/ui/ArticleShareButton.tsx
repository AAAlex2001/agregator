"use client";

import Button from "@/source/shared/ui/Button";
import { useNotifications } from "@/source/shared/ui/Notifications";
import s from "./ArticleView.module.scss";

interface Props {
  url: string;
}

function copyWithFallback(value: string): void {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

export function ArticleShareButton({ url }: Props) {
  const { showSuccess, showError } = useNotifications();

  const handleShare = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        copyWithFallback(url);
      }
      showSuccess("Ссылка успешно скопирована");
    } catch {
      showError("Не удалось скопировать ссылку");
    }
  };

  return (
    <Button type="button" variant="outline" size="sm" className={s.shareButton} onClick={handleShare}>
      Поделиться
    </Button>
  );
}
