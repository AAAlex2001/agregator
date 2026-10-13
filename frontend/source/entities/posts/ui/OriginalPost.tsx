import Link from "next/link";
import type { RepostedPost } from "../model/types";
import { PostHead } from "./PostHead";
import { PostContent } from "./PostContent";
import s from "./post.module.scss";

/** Показывает исходную публикацию внутри репоста. */
export function OriginalPost({ post }: { post: RepostedPost }) {
  return (
    <div className={s.original}>
      <PostHead
        author={post.author}
        date={post.published_at ?? post.created_at}
      />
      <PostContent
        html={post.html}
        media={post.media}
      />
      <Link
        className={s.originalLink}
        href={`/posts/${post.id}`}
      >
        Открыть публикацию
      </Link>
    </div>
  );
}
