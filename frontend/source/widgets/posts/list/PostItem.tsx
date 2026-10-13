"use client";

import { PostCard, type Post } from "@/source/entities/posts";
import { PostMenu } from "@/source/features/posts/post/actions/PostMenu";
import { PostReactions } from "@/source/features/posts/post/reactions";
import { usePostView } from "@/source/features/posts/post/track-view/usePostView";

/** Соединяет карточку публикации с меню, реакциями и учётом просмотра. */
export function PostItem({
  post,
  onDeleted,
  onUnsaved,
}: {
  post: Post;
  onDeleted: () => void;
  onUnsaved?: () => void;
}) {
  const published = post.status === "published";
  const ref = usePostView(post.id, published);
  return (
    <PostCard
      ref={ref}
      post={post}
      menu={
        <PostMenu
          post={post}
          onDeleted={onDeleted}
        />
      }
      footer={
        published && (
          <PostReactions
            post={post}
            onUnsaved={onUnsaved}
          />
        )
      }
    />
  );
}
