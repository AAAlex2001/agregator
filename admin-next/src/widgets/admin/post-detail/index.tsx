"use client";

import { useRouter } from "next/navigation";
import { PostCard } from "@/entities/posts";
import { PostActions, usePost } from "@/features/posts-admin";
import { POSTS_PATH, accountPostsPath } from "@/shared/lib/admin-paths";
import Button from "@/shared/ui/button";
import Loader from "@/shared/ui/loader";
import Message from "@/shared/ui/message";
import Page from "@/shared/ui/page";
import PageHeader from "@/shared/ui/page-header";

/** Просмотр публикации любого статуса и решение модератора. */
export default function AdminPostDetail({ postId }: { postId: number }) {
  const router = useRouter();
  const { post, error, reload } = usePost(postId);

  return (
    <Page>
      <PageHeader
        title={`Публикация №${postId}`}
        backHref={POSTS_PATH}
        action={post && (
          <Button variant="outline" href={accountPostsPath(post.author.id)}>
            Все публикации автора
          </Button>
        )}
      />
      {error && (
        <div role="alert">
          <Message tone="error">{error}</Message>
          <Button variant="outline" onClick={reload}>Повторить</Button>
        </div>
      )}
      {!post && !error && <Loader size="lg" />}
      {post && (
        <PostCard
          post={post}
          actions={
            <PostActions
              post={post}
              onChanged={reload}
              onDeleted={() => router.replace(POSTS_PATH)}
            />
          }
        />
      )}
    </Page>
  );
}
