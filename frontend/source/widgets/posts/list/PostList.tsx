"use client";

import { useState } from "react";
import type { PostPage, PostFeedQuery } from "@/source/entities/posts";
import { usePostList } from "@/source/features/posts/feed/load-posts/model/usePostList";
import Button from "@/source/shared/ui/Button";
import { EmptyState } from "@/source/shared/ui/EmptyState";
import { PostCardSkeleton, PostsSkeleton } from "../skeleton";
import { PostItem } from "./PostItem";
import { Subtitle, Title } from "@/source/shared/ui/Typography";
import s from "../posts.module.scss";

interface Props {
  query: PostFeedQuery;
  emptyTitle: string;
  emptyText: string;
  initial?: PostPage;
  offset?: number;
  onChanged?: () => void;
}

/** Список публикаций с состояниями загрузки, ошибкой и следующей порцией. */
export function PostList({ query, emptyTitle, emptyText, initial, offset, onChanged }: Props) {
  const list = usePostList(query, initial, offset);
  const [hidden, setHidden] = useState<number[]>([]);
  const items = list.items.filter((post) => !hidden.includes(post.id));
  const deleted = () => {
    list.reload();
    onChanged?.();
  };
  const unsaved = (id: number) => {
    setHidden((previous) => [...previous, id]);
    list.reload();
  };
  return (
    <>
      {list.error && (
        <div className={s.error} role="alert">
          <EmptyState
            title="Ошибка загрузки"
            subtitle={list.error}
            actionLabel="Повторить"
            onAction={list.reload}
          />
        </div>
      )}
      {list.loading && list.items.length === 0 && <PostsSkeleton />}
      {!list.loading && !list.error && items.length === 0 && (
        <div className={s.empty}>
          <Title as="h2" text={emptyTitle} className={s.emptyTitle} />
          <Subtitle text={emptyText} className={s.emptySubtitle} />
          <Button href={query.mode === "my" ? "/posts/new" : "/posts"}>
            {query.mode === "my" ? "Написать пост" : "Перейти в ленту"}
          </Button>
        </div>
      )}
      <div className={s.list}>
        {items.map((post) => (
          <PostItem
            key={post.id}
            post={post}
            onDeleted={deleted}
            onUnsaved={query.mode === "saved" ? () => unsaved(post.id) : undefined}
          />
        ))}
      </div>
      {list.loadingMore && <PostCardSkeleton />}
      {list.hasMore && (
        <Button
          variant="secondary"
          disabled={list.loading}
          onClick={list.loadMore}
        >
          Показать ещё
        </Button>
      )}
    </>
  );
}
