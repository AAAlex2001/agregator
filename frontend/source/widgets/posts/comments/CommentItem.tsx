"use client";

import { useState, type ReactNode } from "react";
import { CommentCard, type PostComment } from "@/source/entities/posts";
import { useSession } from "@/source/entities/session";
import { useAuthModal } from "@/source/shared/lib/auth-modal";
import { CommentForm, CommentLike, CommentMenu } from "@/source/features/posts/comments";
import s from "./comments.module.scss";

interface Props {
  postId: number;
  comment: PostComment;
  onReply: (comment: PostComment) => void;
  onChanged: () => void;
  children?: ReactNode;
}

/** Соединяет комментарий с правкой, лайком и действием «Ответить». */
export function CommentItem({ postId, comment, onReply, onChanged, children }: Props) {
  const { user } = useSession();
  const { openAuth } = useAuthModal();
  const [editing, setEditing] = useState(false);
  const reply = () => {
    if (user) onReply(comment);
    else openAuth("login");
  };
  const saved = () => {
    setEditing(false);
    onChanged();
  };
  return (
    <CommentCard
      comment={comment}
      menu={
        <CommentMenu
          comment={comment}
          onEdit={() => setEditing(true)}
          onChanged={onChanged}
        />
      }
      editor={
        editing && (
          <CommentForm
            postId={postId}
            comment={comment}
            onSaved={saved}
            onCancel={() => setEditing(false)}
          />
        )
      }
      actions={
        <div className={s.actions}>
          <button
            type="button"
            className={s.reply}
            onClick={reply}
          >
            Ответить
          </button>
          <CommentLike comment={comment} />
        </div>
      }
    >
      {children}
    </CommentCard>
  );
}
