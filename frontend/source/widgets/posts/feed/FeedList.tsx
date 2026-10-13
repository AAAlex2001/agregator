"use client";

import { useRouter } from "next/navigation";
import type { Post } from "@/source/entities/posts";
import { EmptyState } from "@/source/shared/ui/EmptyState";
import { PostItem } from "../list/PostItem";
import s from "../posts.module.scss";

interface FeedListProps {
  posts: Post[];
}

/** Публикации страницы ленты, пришедшие с сервера. После удаления своей публикации страница перечитывается. */
export function FeedList({ posts }: FeedListProps) {
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
    <div className={s.list}>
      {posts.map((post) => (
        <PostItem key={post.id} post={post} onDeleted={() => router.refresh()} />
      ))}
    </div>
  );
}
