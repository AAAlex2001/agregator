"use client";

import { Button, Modal } from "@/source/shared/ui";
import s from "./DeleteCommentModal.module.scss";

interface Props {
  open: boolean;
  isLoading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteCommentModal({ open, isLoading = false, onCancel, onConfirm }: Props) {
  return (
    <Modal open={open} onClose={onCancel} size="sm" isBusy={isLoading} ariaLabelledBy="delete-comment-title">
      <h2 id="delete-comment-title" className={s.title}>Удалить комментарий?</h2>
      <p className={s.desc}>Комментарий и ответы на него удалятся безвозвратно.</p>
      <div className={s.buttons}>
        <Button variant="chat" fullWidth onClick={onCancel}>
          Отмена
        </Button>
        <Button variant="danger" fullWidth onClick={onConfirm} isLoading={isLoading}>
          Удалить
        </Button>
      </div>
    </Modal>
  );
}
