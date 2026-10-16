"use client";

import type { Post } from "@/entities/post";
import { CopyPostLinkButton } from "@/features/copy-post-link";
import { LikePostButton } from "@/features/like-post";
import { RepostMenu } from "@/features/repost-post";
import { SavePostButton } from "@/features/save-post";
import { MessageCircleIcon } from "@/shared/ui/icons";
import { ToolButton } from "@/shared/ui/tool-button";
import { usePostsLogin } from "../../model/login-context";
import styles from "./style.module.scss";

/** Опубликованная запись, под которой стоит панель. */
interface PostActionsProps {
  post: Post;
}

/** Нижняя панель публикации: лайк, комментарии, репост, сохранение и ссылка. */
export function PostActions({ post }: PostActionsProps) {
  const openLogin = usePostsLogin();

  return (
    <div className={styles.panel}>
      <LikePostButton
        post={post}
        onLogin={openLogin}
      />
      <ToolButton
        label="Комментарии"
        href={`/posts/${post.id}#comments`}
      >
        <MessageCircleIcon />
        <span>{post.comments_count}</span>
      </ToolButton>
      <RepostMenu
        post={post}
        onLogin={openLogin}
      />
      <SavePostButton
        post={post}
        onLogin={openLogin}
      />
      <CopyPostLinkButton postId={post.id} />
    </div>
  );
}
