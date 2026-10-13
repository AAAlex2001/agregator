import Link from "next/link";
import type { ReactNode } from "react";
import { PostAvatar } from "./PostAvatar";
import type { PostComment } from "../model/types";
import s from "./comment.module.scss";

interface Props {
  comment: PostComment;
  menu?: ReactNode;
  editor?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
}

/** Показывает автора, текст комментария и слоты для действий и ответов. */
export function CommentCard({ comment, menu, editor, actions, children }: Props) {
  const name = comment.author.name || "Пользователь";
  return (
    <article className={s.card}>
      <PostAvatar
        src={comment.author.avatar_url}
        name={name}
        className={s.avatar}
      />
      <div className={s.body}>
        <div className={s.head}>
          <Link
            className={s.author}
            href={`/posts?author=${comment.author.id}`}
          >
            {name}
          </Link>
          {menu}
        </div>
        <time
          className={s.date}
          dateTime={comment.created_at}
        >
          {new Date(comment.created_at).toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </time>
        {editor || (
          <p className={s.text}>
            {comment.reply_to_name && <span className={s.replyTo}>{comment.reply_to_name}, </span>}
            {comment.text}
          </p>
        )}
        {actions}
        {children}
      </div>
    </article>
  );
}
