"use client";

import cn from "classnames";
import { useState } from "react";
import {
  toggleCommentLike,
  type PostComment,
  type PostLikes,
} from "@/source/entities/posts";
import { useSession } from "@/source/entities/session";
import { useAuthModal } from "@/source/shared/lib/auth-modal";
import { HeartIcon } from "@/source/entities/posts/ui/icons";
import s from "./comments.module.scss";

/** Добавляет или убирает лайк у комментария. */
export function CommentLike({ comment }: { comment: PostComment }) {
  const { user } = useSession();
  const { openAuth } = useAuthModal();
  const [result, setResult] = useState<PostLikes | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const reaction = result ?? comment;

  const toggle = async () => {
    if (!user) return openAuth("login");
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      setResult(await toggleCommentLike(comment.id, !reaction.liked));
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Не удалось изменить лайк");
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <button
        type="button"
        className={cn(s.like, reaction.liked && s.liked)}
        disabled={busy}
        aria-label={reaction.liked ? "Убрать лайк" : "Нравится"}
        aria-pressed={reaction.liked}
        onClick={toggle}
      >
        <HeartIcon />
        {reaction.likes_count}
      </button>
      {error && (
        <p
          className={s.error}
          role="alert"
        >
          {error}
        </p>
      )}
    </>
  );
}
