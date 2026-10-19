"use client";

import { useState } from "react";
import type { Post } from "@/entities/post";
import { useCopyPostLink } from "@/features/copy-post-link";
import { DeletePostDialog } from "@/features/delete-post";
import { EyeIcon, PencilIcon, ShareIcon, TrashIcon } from "@/shared/ui/icons";
import { ToolButton } from "@/shared/ui/tool-button";
import styles from "./style.module.scss";

/** Свой пост и что сделать после его удаления. */
interface MyPostActionsProps {
  post: Post;
  onDeleted: () => void;
}

/** Открыть на сайте и поделиться — если пост в ленте; удалить; изменить — если это не репост. */
export function MyPostActions({ post, onDeleted }: MyPostActionsProps) {
  const copyLink = useCopyPostLink(post.id);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const isOnSite = post.on_site && post.status === "published";

  /** Закрывает подтверждение и обновляет список. */
  function finishDeletion() {
    setIsDeleteOpen(false);
    onDeleted();
  }

  return (
    <div className={styles.actions}>
      {isOnSite && (
        <ToolButton
          label="Открыть на сайте"
          href={`/posts/${post.id}`}
        >
          <EyeIcon />
        </ToolButton>
      )}
      {isOnSite && (
        <ToolButton
          label="Скопировать ссылку"
          onClick={copyLink}
        >
          <ShareIcon />
        </ToolButton>
      )}
      <ToolButton
        label="Удалить"
        className={styles.danger}
        onClick={() => setIsDeleteOpen(true)}
      >
        <TrashIcon />
      </ToolButton>
      {!post.repost_of && (
        <ToolButton
          label="Изменить"
          href={`/posts/${post.id}/edit`}
        >
          <PencilIcon />
        </ToolButton>
      )}
      <DeletePostDialog
        post={post}
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onDeleted={finishDeletion}
      />
    </div>
  );
}
