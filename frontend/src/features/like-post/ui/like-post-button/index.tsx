"use client";

import cn from "classnames";
import type { Post } from "@/entities/post";
import { HeartIcon } from "@/shared/ui/icons";
import { ToolButton } from "@/shared/ui/tool-button";
import { useLikePost } from "../../model/use-like-post";
import styles from "./style.module.scss";

/** Публикация и вход для гостя. */
interface LikePostButtonProps {
  post: Post;
  onLogin: () => void;
}

/** Сердце со счётчиком лайков публикации. */
export function LikePostButton({ post, onLogin }: LikePostButtonProps) {
  const {
    liked,
    likes,
    isSending,
    toggleLike,
  } = useLikePost(post, onLogin);
  const label = liked ? "Убрать лайк" : "Нравится";

  return (
    <ToolButton
      label={label}
      pressed={liked}
      disabled={isSending}
      className={cn(styles.like, { [styles.liked]: liked })}
      onClick={toggleLike}
    >
      <HeartIcon />
      <span>{likes}</span>
    </ToolButton>
  );
}
