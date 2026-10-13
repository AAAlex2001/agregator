"use client";

import { deletePost, setPostStatus, type Post } from "@/entities/posts";
import Button from "@/shared/ui/button";
import ConfirmModal from "@/shared/ui/confirm-modal";
import { useModeration } from "../model/use-moderation";
import styles from "./style.module.scss";

type PostActionsProps = {
  post: Post;
  onChanged: () => void;
  onDeleted: () => void;
};

/** Скрывает пост, возвращает скрытый или удаляет после подтверждения. */
export function PostActions({ post, onChanged, onDeleted }: PostActionsProps) {
  const moderation = useModeration();

  return (
    <div className={styles.actions}>
      {post.status === "published" && (
        <Button
          variant="outline"
          disabled={moderation.pending}
          onClick={() => moderation.run(() => setPostStatus(post.id, "hidden"), onChanged)}
        >
          Скрыть
        </Button>
      )}
      {post.status === "hidden" && (
        <Button
          disabled={moderation.pending}
          onClick={() => moderation.run(() => setPostStatus(post.id, "published"), onChanged)}
        >
          Вернуть в ленту
        </Button>
      )}
      <Button variant="danger" disabled={moderation.pending} onClick={moderation.askRemove}>
        Удалить
      </Button>

      <ConfirmModal
        open={moderation.confirming}
        title="Удалить публикацию?"
        text="Публикация, её файлы, репосты и комментарии будут удалены без возможности восстановления."
        confirmLabel="Удалить"
        pending={moderation.pending}
        onCancel={moderation.cancelRemove}
        onConfirm={() => moderation.run(() => deletePost(post.id), onDeleted)}
      />
    </div>
  );
}
