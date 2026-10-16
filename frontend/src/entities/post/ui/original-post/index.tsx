import Link from "next/link";
import type { RepostedPost } from "../../model/types";
import { PostContent } from "../post-content";
import { PostHead } from "../post-head";
import styles from "./style.module.scss";

/** Исходная запись, показанная внутри репоста. */
interface OriginalPostProps {
  post: RepostedPost;
}

/** Показывает оригинал репоста со ссылкой на его отдельную страницу. */
export function OriginalPost({ post }: OriginalPostProps) {
  const date = post.published_at ?? post.created_at;

  return (
    <div className={styles.original}>
      <PostHead
        author={post.author}
        date={date}
      />
      <PostContent
        html={post.html}
        media={post.media}
      />
      <Link
        className={styles.originalLink}
        href={`/posts/${post.id}`}
      >
        Открыть публикацию
      </Link>
    </div>
  );
}
