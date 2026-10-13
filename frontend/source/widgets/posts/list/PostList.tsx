"use client";

import type { PostFeedQuery } from "@/source/entities/posts";
import { usePostList } from "@/source/features/posts/load-posts";
import Button from "@/source/shared/ui/Button";
import { EmptyState } from "@/source/shared/ui/EmptyState";
import { PostCardSkeleton, PostsSkeleton } from "../skeleton";
import { PostItem } from "./PostItem";
import s from "../posts.module.scss";

interface PostListProps {
  query: PostFeedQuery;
  emptyTitle: string;
  emptyText: string;
  emptyAction: { label: string; href: string };
}

/** Личный раздел публикаций: загрузка, пустое состояние, ошибка с повтором и «Показать ещё». */
export function PostList({ query, emptyTitle, emptyText, emptyAction }: PostListProps) {
  const list = usePostList(query);

  if (list.isLoading) return <PostsSkeleton />;
  if (list.error) {
    return (
      <EmptyState title="Ошибка загрузки" subtitle={list.error} actionLabel="Повторить" onAction={list.reload} />
    );
  }
  if (list.items.length === 0) {
    return (
      <EmptyState title={emptyTitle} subtitle={emptyText} actionLabel={emptyAction.label} actionHref={emptyAction.href} />
    );
  }

  return (
    <>
      <div className={s.list}>
        {list.items.map((post) => (
          <PostItem
            key={post.id}
            post={post}
            onDeleted={() => list.remove(post.id)}
            onUnsaved={query.mode === "saved" ? () => list.remove(post.id) : undefined}
          />
        ))}
      </div>
      {list.isLoadingMore && <PostCardSkeleton />}
      {list.hasMore && !list.isLoadingMore && (
        <Button variant="secondary" onClick={list.loadMore}>
          Показать ещё
        </Button>
      )}
    </>
  );
}
