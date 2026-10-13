import type { ReactNode, Ref } from "react";
import type { Post } from "../model/types";
import { OriginalPost } from "./OriginalPost";
import { PostContent } from "./PostContent";
import { PostHead } from "./PostHead";
import s from "./post.module.scss";

interface PostCardProps {
  post: Post;
  menu?: ReactNode;
  footer?: ReactNode;
  ref?: Ref<HTMLElement>;
}

/**
 * Публикация целиком: автор, текст, медиа и оригинал репоста.
 * Меню и реакции приходят слотами.
 */
export function PostCard({ post, menu, footer, ref }: PostCardProps) {
  const date = post.published_at ?? post.created_at;
  const note = post.repost_of ? "репост" : undefined;
  const views = post.status === "published" ? post.views_count : undefined;

  return (
    <article ref={ref} className={s.card}>
      <PostHead
        author={post.author}
        date={date}
        note={note}
        views={views}
        menu={menu}
      />
      <PostContent html={post.html} media={post.media} />
      {post.repost_of && <OriginalPost post={post.repost_of} />}
      {footer}
    </article>
  );
}
