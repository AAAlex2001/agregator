import Link from "next/link";
import type { ReactNode } from "react";
import { formatDateLong } from "@/source/shared/lib/formatDate";
import type { PostComment } from "../model/types";
import { PostAvatar } from "./PostAvatar";
import s from "./comment.module.scss";

interface CommentCardProps {
  comment: PostComment;
  menu?: ReactNode;
  editor?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
}

/** Автор и текст комментария; действия, форма правки и ответы приходят слотами. */
export function CommentCard({ comment, menu, editor, actions, children }: CommentCardProps) {
  const name = comment.author.name || "Пользователь";
  return (
    <article className={s.card}>
      <PostAvatar src={comment.author.avatar_url} name={name} className={s.avatar} />
      <div className={s.body}>
        <div className={s.head}>
          <Link className={s.author} href={`/posts?author=${comment.author.id}`}>
            {name}
          </Link>
          {menu}
        </div>
        <time className={s.date} dateTime={comment.created_at}>
          {formatDateLong(comment.created_at)}
        </time>
        {editor || (
          <p className={s.text}>
            {comment.reply_to_name && (
              <span className={s.replyTo}>{comment.reply_to_name}, </span>
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
