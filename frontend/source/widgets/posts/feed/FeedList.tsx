"use client";

import { useRouter } from "next/navigation";
import type { Post } from "@/source/entities/posts";
import Button from "@/source/shared/ui/Button";
import { EmptyState } from "@/source/shared/ui/EmptyState";
import { PostItem } from "../list/PostItem";
import s from "../posts.module.scss";

interface FeedListProps {
  posts: Post[];
  nextPageHref?: string;
}

/** Публикации ленты с сервера и «Показать ещё» — ссылка, по которой проходят и поисковые роботы. */
export function FeedList({ posts, nextPageHref }: FeedListProps) {
  const router = useRouter();

  if (posts.length === 0) {
    return (
      <EmptyState
        title="Публикаций пока нет"
        subtitle="Поделитесь опытом, новостями и полезными материалами."
        actionLabel="Написать пост"
        actionHref="/posts/new"
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
