"use client";

import cn from "classnames";
import type { PostComment } from "@/entities/post";
import { HeartIcon } from "@/shared/ui/icons";
import { useLikeComment } from "../../model/use-like-comment";
import styles from "./style.module.scss";

/** Комментарий и вход для гостя. */
interface LikeCommentButtonProps {
  comment: PostComment;
  onLogin: () => void;
}

/** Сердце со счётчиком лайков комментария. */
export function LikeCommentButton({ comment, onLogin }: LikeCommentButtonProps) {
  const {
    liked,
    likes,
    isSending,
    toggleLike,
  } = useLikeComment(comment, onLogin);
  const label = liked ? "Убрать лайк" : "Нравится";

  return (
    <button
      type="button"
      className={cn(styles.like, {
        [styles.liked]: liked,
      })}
      disabled={isSending}
      aria-label={label}
      aria-pressed={liked}
      onClick={toggleLike}
    >
      <HeartIcon />
      {likes}
    </button>
  );
}
