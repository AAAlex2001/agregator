"use client";

import { useRouter } from "next/navigation";
import type { Post } from "@/entities/post";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/empty-state";
import { MyPostCard } from "../my-post-card";
import styles from "./style.module.scss";

/** Свои посты из вкладки и адрес следующей страницы. */
interface MyPostGridProps {
  posts: Post[];
  nextPageHref?: string;
}

/** Свои посты карточками в две колонки. После удаления страница перечитывается с сервера. */
export function MyPostGrid({ posts, nextPageHref }: MyPostGridProps) {
  const router = useRouter();

  if (posts.length === 0) {
    return (
      <EmptyState
        title="Здесь пока пусто"
        subtitle="Напишите пост в ленту сайта или в свои Telegram-каналы."
        actionLabel="Написать пост"
        actionHref="/posts/new"
      />
    );
  }

  return (
    <>
      <div className={styles.grid}>
        {posts.map((post) => (
          <MyPostCard
            key={post.id}
            post={post}
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
          >
            Показать ещё
          </Button>
        </div>
      )}
    </>
  );
}
