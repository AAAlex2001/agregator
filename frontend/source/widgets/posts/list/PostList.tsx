"use client";

import { useRouter } from "next/navigation";
import type { Post } from "@/source/entities/posts";
import Button from "@/source/shared/ui/Button";
import { EmptyState } from "@/source/shared/ui/EmptyState";
import { PostItem } from "./PostItem";
import s from "../posts.module.scss";

interface PostListProps {
  posts: Post[];
  nextPageHref?: string;
  emptyTitle: string;
  emptyText: string;
  emptyActionLabel: string;
  emptyActionHref: string;
}

/** Публикации, пришедшие с сервера, и «Показать ещё» — ссылка на следующую страницу.
 *  После удаления публикации страница перечитывается с сервера. */
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
      <div className={s.list}>
        {posts.map((post) => (
          <PostItem
            key={post.id}
            post={post}
            onDeleted={() => router.refresh()}
          />
        ))}
      </div>
      {nextPageHref && (
        <div className={s.loadMore}>
          <Button
            href={nextPageHref}
            scroll={false}
            variant="outline"
            className={s.loadMoreButton}
          >
            Показать ещё
          </Button>
        </div>
      )}
    </>
  );
}
