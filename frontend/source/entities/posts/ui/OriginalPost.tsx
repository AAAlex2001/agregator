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
  return (
    <div className={s.original}>
      <PostHead author={post.author} date={post.published_at ?? post.created_at} />
      <PostContent html={post.html} media={post.media} />
      <Link className={s.originalLink} href={`/posts/${post.id}`}>
        Открыть публикацию
      </Link>
    </div>
  );
}
