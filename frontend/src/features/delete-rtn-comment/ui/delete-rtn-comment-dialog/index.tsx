"use client";

import { ConfirmModal } from "@/shared/ui/confirm-modal";

/** Подтверждение удаления и состояние отправленного запроса. */
interface DeleteRtnCommentDialogProps {
  open: boolean;
  isBusy: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Предупреждает об удалении всей ветки обсуждения. */
export function DeleteRtnCommentDialog({
  open,
  isBusy,
  onConfirm,
  onCancel,
}: DeleteRtnCommentDialogProps) {
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
