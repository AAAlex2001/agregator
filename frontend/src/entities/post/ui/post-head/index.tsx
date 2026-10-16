import Link from "next/link";
import type { ReactNode } from "react";
import { formatDateLong } from "@/shared/lib/format-date";
import type { PostAuthor } from "../../model/types";
import { PostAvatar } from "../post-avatar";
import styles from "./style.module.scss";

/** Автор, дата, просмотры и переданное меню публикации. */
interface PostHeadProps {
  author: PostAuthor;
  date?: string;
  note?: string;
  views?: number;
  menu?: ReactNode;
}

/** Показывает автора со ссылкой на его публикации и сведения о записи. */
export function PostHead({
  author,
  date,
  note,
  views,
  menu,
}: PostHeadProps) {
  const name = author.name || "Пользователь";

  return (
    <div className={styles.head}>
      <Link
        className={styles.author}
        href={`/posts?author=${author.id}`}
      >
        <PostAvatar
          src={author.avatar_url}
          name={name}
        />
        <span className={styles.info}>
          <span className={styles.name}>{name}</span>
          {date && (
            <span className={styles.date}>
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
