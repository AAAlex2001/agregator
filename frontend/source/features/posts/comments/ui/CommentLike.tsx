"use client";

import cn from "classnames";
import { useState } from "react";
import { HeartIcon, toggleCommentLike, type PostComment } from "@/source/entities/posts";
import { useSession } from "@/source/entities/session";
import { useAuthModal } from "@/source/shared/lib/auth-modal";
import { useNotifications } from "@/source/shared/ui/Notifications";
import s from "./comments.module.scss";

interface CommentLikeProps {
  comment: PostComment;
}

/** Лайк комментария со счётчиком. */
export function CommentLike({ comment }: CommentLikeProps) {
  const { user } = useSession();
  const { openAuth } = useAuthModal();
  const { showError } = useNotifications();
  const [liked, setLiked] = useState(comment.liked);
  const [likes, setLikes] = useState(comment.likes_count);
  const [isBusy, setIsBusy] = useState(false);

  const toggle = async () => {
    if (!user) {
      return openAuth("login");
    }

    setIsBusy(true);
    try {
      const result = await toggleCommentLike(comment.id, !liked);
      setLiked(result.liked);
      setLikes(result.likes_count);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Не удалось изменить лайк";
      showError(message);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <button
      type="button"
      className={cn(s.like, { [s.liked]: liked })}
      disabled={isBusy}
      aria-label={liked ? "Убрать лайк" : "Нравится"}
      aria-pressed={liked}
      onClick={toggle}
    >
      <HeartIcon />
      {likes}
    </button>
  );
}
