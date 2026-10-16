"use client";

import { useId } from "react";
import { Button } from "@/shared/ui/button";
import { Modal } from "@/shared/ui/modal";
import styles from "./style.module.scss";

/** Закрытие окна и переход к отзыву о завершённом проекте. */
interface CompletionModalProps {
  onClose: () => void;
  onLeaveReview: () => void;
}

/** Сообщает о завершении проекта и предлагает оставить отзыв исполнителю. */
export function CompletionModal({ onClose, onLeaveReview }: CompletionModalProps) {
  const titleId = useId();

  return (
    <Modal
      open
      onClose={onClose}
      size="sm"
      ariaLabelledBy={titleId}
    >
      <div className={styles.content}>
        <div
          id={titleId}
          className={styles.title}
        >
          Проект успешно завершён
        </div>
        <div className={styles.subtitle}>Теперь вы можете оставить отзыв</div>
      </div>
      <div className={styles.actions}>
        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={onLeaveReview}
        >
          Оставить отзыв
        </Button>
      </div>
    </Modal>
  );
}
