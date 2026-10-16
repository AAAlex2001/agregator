import Link from "next/link";
import type { ReactNode } from "react";
import { formatDateLong } from "@/shared/lib/format-date";
import type { PostComment } from "../../model/types";
import { PostAvatar } from "../post-avatar";
import styles from "./style.module.scss";

/** Комментарий с переданными меню, формой редактирования, действиями и ответами. */
interface PostCommentCardProps {
  comment: PostComment;
  menu?: ReactNode;
  editor?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
}

/** Показывает автора и текст комментария, сохраняя место для действий и ответов. */
export function PostCommentCard({
  comment,
  menu,
  editor,
  actions,
  children,
}: PostCommentCardProps) {
  const name = comment.author.name || "Пользователь";

  return (
    <article className={styles.card}>
      <PostAvatar
        src={comment.author.avatar_url}
        name={name}
        className={styles.avatar}
      />
      <div className={styles.body}>
        <div className={styles.head}>
          <Link
            className={styles.author}
            href={`/posts?author=${comment.author.id}`}
          >
            {name}
          </Link>
          {menu}
        </div>
        <time
          className={styles.date}
          dateTime={comment.created_at}
        >
          {formatDateLong(comment.created_at)}
        </time>
        {editor || (
          <p className={styles.text}>
            {comment.reply_to_name && (
              <span className={styles.replyTo}>
                {`${comment.reply_to_name}, `}
              </span>
            )}
            {comment.text}
          </p>
        )}
        {actions}
        {children}
      </div>
    </article>
  );
}
