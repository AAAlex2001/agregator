"use client";

import cn from "classnames";
import { useState } from "react";
import {
  ArticleCommentContent,
  useArticleComments,
  type ArticleComment,
} from "@/entities/article";
import { AddArticleCommentForm } from "@/features/add-article-comment";
import {
  DeleteArticleCommentButton,
  DeleteArticleCommentDialog,
  useDeleteArticleComment,
} from "@/features/delete-article-comment";
import { Button } from "@/shared/ui/button";
import styles from "./style.module.scss";

/** Комментарий в дереве обсуждения и отступ для вложенного ответа. */
interface ArticleCommentThreadProps {
  comment: ArticleComment;
  isReply?: boolean;
}

/** Собирает комментарий, действия и вложенные ответы на него. */
export function ArticleCommentThread({
  comment,
  isReply = false,
}: ArticleCommentThreadProps) {
  const { comments } = useArticleComments();
  const deletion = useDeleteArticleComment(comment.id);
  const [isReplying, setIsReplying] = useState(false);
  const replies = comments.filter((item) => item.parent_id === comment.id);

  /** Открывает или скрывает поле ответа под комментарием. */
  function toggleReply() {
    setIsReplying((isOpen) => !isOpen);
  }

  /** Скрывает поле после успешной отправки ответа. */
  function closeReply() {
    setIsReplying(false);
  }

  return (
    <div
      className={cn(styles.comment, {
        [styles.reply]: isReply,
      })}
    >
      <ArticleCommentContent comment={comment} />
      <div className={styles.actions}>
        <Button
          variant="transparent"
          size="sm"
          onClick={toggleReply}
        >
          Ответить
        </Button>
        {comment.is_mine && (
          <DeleteArticleCommentButton onClick={deletion.open} />
        )}
      </div>

      {isReplying && (
        <AddArticleCommentForm
          parentId={comment.id}
          placeholder="Ваш ответ…"
          submitLabel="Ответить"
          onAdded={closeReply}
        />
      )}

      {replies.length > 0 && (
        <div className={styles.replies}>
          {replies.map((reply) => (
            <ArticleCommentThread
              key={reply.id}
              comment={reply}
              isReply
            />
          ))}
        </div>
      )}

      <DeleteArticleCommentDialog
        open={deletion.isOpen}
        isBusy={deletion.isDeleting}
        onConfirm={deletion.confirm}
        onCancel={deletion.close}
      />
    </div>
  );
}
