"use client";

import cn from "classnames";
import Image from "next/image";
import type { Post } from "@/entities/post";
import { formatWithTime } from "@/shared/lib/format-date";
import { EyeIcon, GlobeIcon, HeartIcon, MessageCircleIcon, TelegramIcon } from "@/shared/ui/icons";
import { postStatusLabel } from "../../config/my-post-labels";
import { MyPostActions } from "../my-post-actions";
import { PostDeliveries } from "../post-deliveries";
import styles from "./style.module.scss";

/** Свой пост и что сделать после его удаления. */
interface MyPostCardProps {
  post: Post;
  onDeleted: () => void;
}

/** Когда пост вышел, выйдет или последний раз менялся. */
function postDate(post: Post): string {
  if (post.status === "published" && post.published_at) {
    return `Опубликован ${formatWithTime(post.published_at)}`;
  }

  if (post.status === "scheduled" && post.scheduled_at) {
    return `Выйдет ${formatWithTime(post.scheduled_at)}`;
  }

  return `Изменён ${formatWithTime(post.updated_at)}`;
}

/**
 * Свой пост карточкой: где выходит (Telegram, сайт), статус, начало текста,
 * каналы со статусом отправки, реакции на сайте и действия.
 */
export function MyPostCard({ post, onDeleted }: MyPostCardProps) {
  const deliveries = post.deliveries.filter((delivery) => delivery.status !== "deleted");
  const isOnSitePublished = post.on_site && post.status === "published";

  return (
    <article className={styles.card}>
      <div className={styles.head}>
        <div className={styles.sources}>
          {deliveries.length > 0 && (
            <span className={cn(styles.source, styles.telegram)}>
              <TelegramIcon />
              Telegram
            </span>
          )}
          {post.on_site && (
            <span className={cn(styles.source, styles.site)}>
              <GlobeIcon />
              Сайт
            </span>
          )}
        </div>
        <span className={cn(styles.status, styles[post.status])}>{postStatusLabel(post.status)}</span>
      </div>

      <div className={styles.body}>
        <p className={styles.text}>{post.description}</p>
        {post.cover_url && (
          <span className={styles.cover}>
            <Image
              src={post.cover_url}
              alt=""
              fill
              sizes="72px"
              unoptimized
            />
          </span>
        )}
      </div>

      {deliveries.length > 0 && <PostDeliveries deliveries={deliveries} />}

      {isOnSitePublished && (
        <div className={styles.stats}>
          <span className={styles.statsLabel}>На сайте</span>
          <span className={styles.stat}>
            <EyeIcon />
            {post.views_count}
          </span>
          <span className={styles.stat}>
            <HeartIcon />
            {post.likes_count}
          </span>
          <span className={styles.stat}>
            <MessageCircleIcon />
            {post.comments_count}
          </span>
        </div>
      )}

      <div className={styles.footer}>
        <span className={styles.date}>{postDate(post)}</span>
        <MyPostActions
          post={post}
          onDeleted={onDeleted}
        />
      </div>
    </article>
  );
}
