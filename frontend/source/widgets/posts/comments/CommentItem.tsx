"use client";

import { useState, type ReactNode } from "react";
import { CommentCard, type PostComment } from "@/source/entities/posts";
import { useSession } from "@/source/entities/session";
import { CommentForm, CommentLike } from "@/source/features/posts/comments";
import { useAuthModal } from "@/source/shared/lib/auth-modal";
import { CommentMenu } from "./CommentMenu";
import s from "./comments.module.scss";

interface CommentItemProps {
  postId: number;
  comment: PostComment;
  onReply: (comment: PostComment) => void;
  onChanged: () => void;
  children?: ReactNode;
}

/** Комментарий с меню, правкой, лайком и кнопкой «Ответить». */
export function CommentItem({
  postId,
  comment,
  onReply,
  onChanged,
  children,
}: CommentItemProps) {
  const { user } = useSession();
  const { openAuth } = useAuthModal();
  const [isEditing, setIsEditing] = useState(false);

  const handleReply = () => {
    if (user) {
      onReply(comment);
    } else {
      openAuth("login");
    }
  };

  const handleSaved = () => {
    setIsEditing(false);
    onChanged();
  };

  return (
    <CommentCard
      comment={comment}
      menu={
        <CommentMenu
          comment={comment}
          onEdit={() => setIsEditing(true)}
          onDeleted={onChanged}
        />
      }
      editor={
        isEditing && (
          <CommentForm
            postId={postId}
            comment={comment}
            onSaved={handleSaved}
            onCancel={() => setIsEditing(false)}
          />
        )
      }
      actions={
        <div className={s.actions}>
          <button type="button" className={s.reply} onClick={handleReply}>
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
