import Link from "next/link";
import type { ReactNode } from "react";
import { accountPath, postPath } from "@/shared/lib/admin-paths";
import { formatDateTime } from "@/shared/lib/date";
import Badge from "@/shared/ui/badge";
import type { Post } from "../../model/types";
import PostContent from "../post-content";
import styles from "./style.module.scss";

type PostCardProps = {
  post: Post;
  actions?: ReactNode;
};

const STATUS_LABELS = {
  published: "Опубликован",
  draft: "Черновик",
  hidden: "Скрыт",
};

/** Карточка модерации: автор, содержимое, оригинал репоста и действия. */
export default function PostCard({ post, actions }: PostCardProps) {
  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <div>
          <Link className={styles.author} href={accountPath(post.author.id)}>
            {post.author.name || `Пользователь №${post.author.id}`}
          </Link>
          <p className={styles.meta}>
            <Link href={postPath(post.id)}>Публикация №{post.id}</Link>
            {" · "}{formatDateTime(post.published_at || post.created_at)}
          </p>
        </div>
        <Badge tone={post.status === "hidden" ? "warning" : "neutral"}>
          {STATUS_LABELS[post.status]}
        </Badge>
      </header>

      <PostContent post={post} />

      {post.repost_of && (
        <section className={styles.original}>
          <Link href={postPath(post.repost_of.id)}>
            Оригинал: {post.repost_of.author.name || `Пользователь №${post.repost_of.author.id}`}
          </Link>
          <PostContent post={post.repost_of} />
        </section>
      )}

      <p className={styles.meta}>
        Просмотры: {post.views_count} · Нравится: {post.likes_count}
        {" · "}Комментарии: {post.comments_count} · Репосты: {post.reposts_count}
      </p>
      {actions}
    </article>
  );
}
