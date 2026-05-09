"use client";

import Button from "@/source/shared/ui/Button";
import { Modal } from "@/source/shared/ui";
import s from "./CompletionModal.module.scss";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLeaveReview?: () => void;
}

export function CompletionModal({ isOpen, onClose, onLeaveReview }: Props) {
  return (
    <Modal open={isOpen} onClose={onClose} size="sm" ariaLabelledBy="completion-modal-title">
      <div className={s.content}>
        <div id="completion-modal-title" className={s.title}>
          Проект успешно завершён
        </div>
        <div className={s.subtitle}>Теперь вы можете оставить отзыв</div>
      </div>

      <div className={s.actions}>
        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={() => {
            onClose();
            onLeaveReview?.();
          }}
        >
          Оставить отзыв
        </Button>
      </div>
    </Modal>
  );
}
