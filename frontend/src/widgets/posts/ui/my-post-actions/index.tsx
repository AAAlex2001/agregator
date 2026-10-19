"use client";

import { useState } from "react";
import type { Post } from "@/entities/post";
import { useCopyPostLink } from "@/features/copy-post-link";
import { DeletePostDialog } from "@/features/delete-post";
import {
  DocumentPlusIcon,
  EyeIcon,
  PencilIcon,
  ShareIcon,
  TelegramIcon,
  TrashIcon,
} from "@/shared/ui/icons";
import { ToolButton } from "@/shared/ui/tool-button";
import styles from "./style.module.scss";

/** Свой пост и что сделать после его удаления. */
interface MyPostActionsProps {
  post: Post;
  onDeleted: () => void;
}

/**
 * Открыть на сайте и поделиться — если пост в ленте; открыть в Telegram и ответить постом —
 * если он там вышел; удалить; изменить — если это не репост.
 */
export function MyPostActions({ post, onDeleted }: MyPostActionsProps) {
  const copyLink = useCopyPostLink(post.id);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const isOnSite = post.on_site && post.status === "published";
  const sent = post.deliveries.filter((delivery) => delivery.status === "sent");
  const telegramUrl = sent.find((delivery) => delivery.message_url)?.message_url;

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
      {telegramUrl && (
        <ToolButton
          label="Открыть в Telegram"
          href={telegramUrl}
          external
        >
          <TelegramIcon />
        </ToolButton>
      )}
      {sent.length > 0 && (
        <ToolButton
          label="Ответить постом"
          href={`/posts/new/telegram?reply_to=${post.id}`}
        >
          <DocumentPlusIcon />
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
