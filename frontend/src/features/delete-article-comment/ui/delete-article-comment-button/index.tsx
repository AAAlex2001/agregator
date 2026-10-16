"use client";

import { Button } from "@/shared/ui/button";
import styles from "./style.module.scss";

/** Открытие подтверждения для собственного комментария. */
interface DeleteArticleCommentButtonProps {
  onClick: () => void;
}

/** Предлагает удалить собственный комментарий. */
export function DeleteArticleCommentButton({
  onClick,
}: DeleteArticleCommentButtonProps) {
  return (
    <Button
      variant="transparent"
      size="sm"
      className={styles.delete}
      onClick={onClick}
    >
      Удалить
    </Button>
  );
}
