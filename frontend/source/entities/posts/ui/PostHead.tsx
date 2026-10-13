import Link from "next/link";
import type { ReactNode } from "react";
import { formatDateLong } from "@/source/shared/lib/formatDate";
import type { PostAuthor } from "../model/types";
import { PostAvatar } from "./PostAvatar";
import s from "./post.module.scss";

interface PostHeadProps {
  author: PostAuthor;
  date?: string;
  note?: string;
  views?: number;
  menu?: ReactNode;
}

/** Автор, дата, просмотры и меню публикации. */
export function PostHead({ author, date, note, views, menu }: PostHeadProps) {
  const name = author.name || "Пользователь";
  return (
    <div className={s.head}>
      <Link className={s.author} href={`/posts?author=${author.id}`}>
        <PostAvatar src={author.avatar_url} name={name} className={s.avatar} />
        <span className={s.info}>
          <span className={s.name}>{name}</span>
          {date && (
            <span className={s.date}>
              <time dateTime={date}>{formatDateLong(date)}</time>
              {note && ` · ${note}`}
              {views !== undefined && ` · Просмотров: ${views}`}
            </span>
          )}
        </span>
      </Link>
      {menu}
    </div>
  );
}
