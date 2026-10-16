"use client";

import { ConfirmModal } from "@/shared/ui/confirm-modal";

/** Состояние удаления комментария и действия подтверждения. */
interface DeleteArticleCommentDialogProps {
  open: boolean;
  isBusy: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Предупреждает об удалении комментария вместе со всеми ответами. */
export function DeleteArticleCommentDialog({
  open,
  isBusy,
  onConfirm,
  onCancel,
}: DeleteArticleCommentDialogProps) {
  return (
    <ConfirmModal
      open={open}
      title="Удалить комментарий?"
      description="Комментарий и ответы на него удалятся безвозвратно."
      confirmLabel="Удалить"
      isBusy={isBusy}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
