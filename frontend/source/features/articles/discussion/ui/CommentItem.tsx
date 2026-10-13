"use client";

import cn from "classnames";
import { useState } from "react";
import type { ArticleComment } from "@/source/entities/article";
import { formatWithTime } from "@/source/shared/lib/formatDate";
import Button from "@/source/shared/ui/Button";
import { ConfirmModal } from "@/source/shared/ui/ConfirmModal";
import { CommentForm } from "./CommentForm";
import s from "./CommentItem.module.scss";

interface CommentItemProps {
  comment: ArticleComment;
  all: ArticleComment[];
  isReply: boolean;
  onReply: (text: string, parentId: number) => Promise<void>;
  onDelete: (commentId: number) => Promise<void>;
}

/** Комментарий с ответами под ним; свой комментарий можно удалить. */
export function CommentItem({ comment, all, isReply, onReply, onDelete }: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const replies = all.filter((item) => item.parent_id === comment.id);

  return (
    <div className={cn(s.comment, { [s.reply]: isReply })}>
      <div className={s.head}>
        <span className={s.author}>{comment.author_name}</span>
        <time className={s.date} dateTime={comment.created_at}>
          {formatWithTime(comment.created_at)}
        </time>
      </div>

      <p className={s.text}>{comment.text}</p>

      <div className={s.actions}>
        <Button variant="transparent" size="sm" onClick={() => setIsReplying((open) => !open)}>
          Ответить
        </Button>
        {comment.is_mine && (
          <Button variant="transparent" size="sm" className={s.delete} onClick={() => setIsDeleteOpen(true)}>
            Удалить
          </Button>
        )}
      </div>

      {isReplying && (
        <CommentForm
          placeholder="Ваш ответ…"
          submitLabel="Ответить"
          onSubmit={async (text) => {
            await onReply(text, comment.id);
            setIsReplying(false);
          }}
        />
      )}

      {replies.length > 0 && (
        <div className={s.replies}>
          {replies.map((item) => (
            <CommentItem key={item.id} comment={item} all={all} isReply onReply={onReply} onDelete={onDelete} />
          ))}
        </div>
      )}

      <ConfirmModal
        open={isDeleteOpen}
        title="Удалить комментарий?"
        description="Комментарий и ответы на него удалятся безвозвратно."
        confirmLabel="Удалить"
        onConfirm={async () => {
          await onDelete(comment.id);
          setIsDeleteOpen(false);
        }}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}
