"use client";

import { useRouter } from "next/navigation";
import type { Post } from "@/entities/post";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/empty-state";
import { PostItem } from "../post-item";
import styles from "./style.module.scss";

/** Публикации раздела, адрес следующей страницы и тексты пустого раздела. */
interface PostListProps {
  posts: Post[];
  nextPageHref?: string;
  emptyTitle: string;
  emptyText: string;
  emptyActionLabel: string;
  emptyActionHref: string;
}

/**
 * Показывает публикации с сервера и «Показать ещё» — ссылку на следующую страницу.
 * После удаления публикации страница перечитывается с сервера.
 */
export function PostList({
  posts,
  nextPageHref,
  emptyTitle,
  emptyText,
  emptyActionLabel,
  emptyActionHref,
}: PostListProps) {
  const router = useRouter();

  if (posts.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        subtitle={emptyText}
        actionLabel={emptyActionLabel}
        actionHref={emptyActionHref}
      />
    );
  }

  return (
    <>
      <div className={styles.list}>
        {posts.map((post) => (
          <PostItem
            key={post.id}
            post={post}
            showOpen
            onDeleted={() => router.refresh()}
          />
        ))}
      </div>
      {nextPageHref && (
        <div className={styles.loadMore}>
          <Button
            href={nextPageHref}
            scroll={false}
            variant="outline"
            className={styles.loadMoreButton}
          >
            Показать ещё
          </Button>
        </div>
      )}
    </>
  );
}
