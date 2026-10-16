"use client";

import { ConfirmModal } from "@/shared/ui/confirm-modal";
import { useDeleteComment } from "../../model/use-delete-comment";

/** Удаляемый комментарий, открытие окна и действие после удаления. */
interface DeleteCommentDialogProps {
  commentId: number;
  open: boolean;
  onClose: () => void;
  onDeleted: () => void;
}

/** Подтверждение удаления комментария и ответов на него. */
export function DeleteCommentDialog({
  commentId,
  open,
  onClose,
  onDeleted,
}: DeleteCommentDialogProps) {
  const { isDeleting, confirmDeletion } = useDeleteComment(commentId, onDeleted);

  return (
    <ConfirmModal
      open={open}
      title="Удалить комментарий?"
      description="Комментарий и ответы на него будут удалены."
      confirmLabel="Удалить"
      isBusy={isDeleting}
      onConfirm={confirmDeletion}
      onCancel={onClose}
    />
  );
}
