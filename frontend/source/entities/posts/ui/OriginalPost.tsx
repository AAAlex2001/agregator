import Link from "next/link";
import type { RepostedPost } from "../model/types";
import { PostContent } from "./PostContent";
import { PostHead } from "./PostHead";
import s from "./post.module.scss";

interface OriginalPostProps {
  post: RepostedPost;
}

/** Исходная публикация внутри репоста. */
export function OriginalPost({ post }: OriginalPostProps) {
  const date = post.published_at ?? post.created_at;

  return (
    <div className={s.original}>
      <PostHead author={post.author} date={date} />
      <PostContent html={post.html} media={post.media} />
      <Link className={s.originalLink} href={`/posts/${post.id}`}>
        Открыть публикацию
      </Link>
    </div>
  );
}
