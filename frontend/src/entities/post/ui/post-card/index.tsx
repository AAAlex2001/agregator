import type { ReactNode, Ref } from "react";
import type { Post } from "../../model/types";
import { OriginalPost } from "../original-post";
import { PostContent } from "../post-content";
import { PostHead } from "../post-head";
import styles from "./style.module.scss";

/** Публикация, переданные действия и ссылка на элемент для учёта просмотра. */
interface PostCardProps {
  post: Post;
  menu?: ReactNode;
  footer?: ReactNode;
  ref?: Ref<HTMLElement>;
}

/** Собирает содержимое публикации; меню и реакции получает готовыми блоками. */
export function PostCard({
  post,
  menu,
  footer,
  ref,
}: PostCardProps) {
  const date = post.published_at ?? post.created_at;
  const note = post.repost_of ? "репост" : undefined;
  const views = post.status === "published" ? post.views_count : undefined;

  return (
    <article
      ref={ref}
      className={styles.card}
    >
      <PostHead
        author={post.author}
        date={date}
        note={note}
        views={views}
        menu={menu}
      />
      <PostContent
        html={post.html}
        media={post.media}
      />
      {post.repost_of && <OriginalPost post={post.repost_of} />}
      {footer}
    </article>
  );
}
