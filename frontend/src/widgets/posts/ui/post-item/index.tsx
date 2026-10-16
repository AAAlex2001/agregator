"use client";

import { PostCard } from "@/entities/post";
import type { Post } from "@/entities/post";
import { useTrackPostView } from "@/features/track-post-view";
import { PostActions } from "../post-actions";
import { PostMenu } from "../post-menu";

/** Публикация, показ ссылки на её страницу в меню и действие после удаления. */
interface PostItemProps {
  post: Post;
  showOpen: boolean;
  onDeleted: () => void;
}

/** Публикация с меню, нижней панелью действий и учётом просмотра. */
export function PostItem({ post, showOpen, onDeleted }: PostItemProps) {
  const isPublished = post.status === "published";
  const cardRef = useTrackPostView(post.id, isPublished);
  const footer = isPublished ? <PostActions post={post} /> : null;

  return (
    <PostCard
      ref={cardRef}
      post={post}
      menu={(
        <PostMenu
          post={post}
          showOpen={showOpen}
          onDeleted={onDeleted}
        />
      )}
      footer={footer}
    />
  );
}
