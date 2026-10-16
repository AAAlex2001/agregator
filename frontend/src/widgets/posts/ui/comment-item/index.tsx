"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { PostCommentCard } from "@/entities/post";
import type { PostComment } from "@/entities/post";
import { useUser } from "@/entities/user";
import { LikeCommentButton } from "@/features/like-post-comment";
import { CommentForm } from "@/features/write-post-comment";
import { usePostsLogin } from "../../model/login-context";
import { CommentMenu } from "../comment-menu";
import styles from "./style.module.scss";

/** Комментарий, ответы под ним и действия обсуждения. */
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
  const { user } = useUser();
  const openLogin = usePostsLogin();
  const [isEditing, setIsEditing] = useState(false);

  /** Открывает форму ответа, а гостю — окно входа. */
  function reply() {
    if (!user) {
      openLogin();
      return;
    }

    onReply(comment);
  }

  /** Закрывает правку и перечитывает обсуждение. */
  function finishEditing() {
    setIsEditing(false);
    onChanged();
  }

  const editor = isEditing ? (
    <CommentForm
      postId={postId}
      comment={comment}
      onSaved={finishEditing}
      onCancel={() => setIsEditing(false)}
      onLogin={openLogin}
    />
  ) : null;

  return (
    <PostCommentCard
      comment={comment}
      menu={(
        <CommentMenu
          comment={comment}
          onEdit={() => setIsEditing(true)}
          onDeleted={onChanged}
        />
      )}
      editor={editor}
      actions={(
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.reply}
            onClick={reply}
          >
            Ответить
          </button>
          <LikeCommentButton
            comment={comment}
            onLogin={openLogin}
          />
        </div>
      )}
    >
      {children}
    </PostCommentCard>
  );
}
