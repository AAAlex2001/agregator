import type { ReactNode, Ref } from "react";
import type { Post } from "../model/types";
import { PostHead } from "./PostHead";
import { PostContent } from "./PostContent";
import { OriginalPost } from "./OriginalPost";
import s from "./post.module.scss";

interface Props {
  post: Post;
  menu?: ReactNode;
  footer?: ReactNode;
  ref?: Ref<HTMLElement>;
}

/** Собирает содержимое поста; действия приходят через слоты. */
export function PostCard({ post, menu, footer, ref }: Props) {
  return (
    <article
      ref={ref}
      className={s.card}
    >
      <PostHead
        author={post.author}
        date={post.published_at ?? post.created_at}
        note={post.repost_of ? "репост" : undefined}
        views={post.status === "published" ? post.views_count : undefined}
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
