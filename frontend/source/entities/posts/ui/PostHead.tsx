import Link from "next/link";
import type { ReactNode } from "react";
import { PostAvatar } from "./PostAvatar";
import type { PostAuthor } from "../model/types";
import s from "./post.module.scss";

interface Props {
  author: PostAuthor;
  date?: string;
  note?: string;
  views?: number;
  menu?: ReactNode;
}

/** Показывает автора, дату, просмотры и меню публикации. */
export function PostHead({ author, date, note, views, menu }: Props) {
  const name = author.name || "Пользователь";
  return (
    <div className={s.head}>
      <Link
        className={s.author}
        href={`/posts?author=${author.id}`}
      >
        <PostAvatar
          src={author.avatar_url}
          name={name}
          className={s.avatar}
        />
        <span className={s.info}>
          <span className={s.name}>{name}</span>
          {date && (
            <span className={s.date}>
              {new Date(date).toLocaleDateString("ru-RU", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
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
