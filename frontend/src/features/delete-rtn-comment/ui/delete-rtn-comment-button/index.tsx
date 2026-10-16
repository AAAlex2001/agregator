"use client";

import { Button } from "@/shared/ui/button";
import styles from "./style.module.scss";

/** Действие открытия подтверждения для своего комментария. */
interface DeleteRtnCommentButtonProps {
  onClick: () => void;
}

/** Предлагает удалить комментарий вместе с ответами. */
export function DeleteRtnCommentButton({ onClick }: DeleteRtnCommentButtonProps) {
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
