"use client";

import { PostCard, type Post } from "@/source/entities/posts";
import { PostReactions } from "@/source/features/posts/reactions";
import { usePostView } from "@/source/features/posts/track-view";
import { PostMenu } from "./PostMenu";

interface PostItemProps {
  post: Post;
  showOpen?: boolean;
  onDeleted: () => void;
  onUnsaved?: () => void;
}

/** Публикация с меню, реакциями и учётом просмотра. */
export function PostItem({ post, showOpen = true, onDeleted, onUnsaved }: PostItemProps) {
  const isPublished = post.status === "published";
  const card = usePostView(post.id, isPublished);

  return (
    <PostCard
      ref={card}
      post={post}
      menu={<PostMenu post={post} showOpen={showOpen} onDeleted={onDeleted} />}
      footer={isPublished && <PostReactions post={post} onUnsaved={onUnsaved} />}
    />
  );
}
