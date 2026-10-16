"use client";

import type { Post } from "@/entities/post";
import { ConfirmModal } from "@/shared/ui/confirm-modal";
import { useDeletePost } from "../../model/use-delete-post";

/** Удаляемая публикация, открытие окна и действие после удаления. */
interface DeletePostDialogProps {
  post: Post;
  open: boolean;
  onClose: () => void;
  onDeleted: () => void;
}

/** Подтверждение удаления публикации или репоста. */
export function DeletePostDialog({
  post,
  open,
  onClose,
  onDeleted,
}: DeletePostDialogProps) {
  const { isDeleting, confirmDeletion } = useDeletePost(post, onDeleted);
  const title = post.repost_of ? "Удалить репост?" : "Удалить публикацию?";

  return (
    <ConfirmModal
      open={open}
      title={title}
      description="Публикация и комментарии к ней будут удалены без возможности восстановления."
      confirmLabel="Удалить"
      isBusy={isDeleting}
      onConfirm={confirmDeletion}
      onCancel={onClose}
    />
  );
}
