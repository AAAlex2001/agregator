"use client";

import type { Post } from "@/entities/post";
import { Checkbox } from "@/shared/ui/checkbox";
import { ConfirmModal } from "@/shared/ui/confirm-modal";
import { useDeletePost } from "../../model/use-delete-post";
import styles from "./style.module.scss";

/** Удаляемая публикация, открытие окна и действие после удаления. */
interface DeletePostDialogProps {
  post: Post;
  open: boolean;
  onClose: () => void;
  onDeleted: () => void;
}

/** Подтверждение удаления публикации или репоста; вышедшую в Telegram можно убрать и оттуда. */
export function DeletePostDialog({
  post,
  open,
  onClose,
  onDeleted,
}: DeletePostDialogProps) {
  const {
    isDeleting,
    isInTelegram,
    fromChannels,
    setFromChannels,
    confirmDeletion,
  } = useDeletePost(post, onDeleted);
  const title = post.repost_of ? "Удалить репост?" : "Удалить публикацию?";

  return (
    <ConfirmModal
      open={open}
      title={title}
      description={(
        <span className={styles.description}>
          Публикация и комментарии к ней будут удалены без возможности восстановления.
          {isInTelegram && (
            <Checkbox
              id={`delete-post-${post.id}-channels`}
              checked={fromChannels}
              onChange={setFromChannels}
            >
              Удалить и из Telegram-каналов
            </Checkbox>
          )}
        </span>
      )}
      confirmLabel="Удалить"
      isBusy={isDeleting}
      onConfirm={confirmDeletion}
      onCancel={onClose}
    />
  );
}
