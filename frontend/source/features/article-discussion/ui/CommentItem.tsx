"use client";

import { useState } from "react";
import type { ArticleComment } from "@/source/entities/article-comment";
import Button from "@/source/shared/ui/Button";
import { CommentForm } from "./CommentForm";
import { DeleteCommentModal } from "./DeleteCommentModal";
import s from "./ArticleDiscussion.module.scss";

interface Props {
  comment: ArticleComment;
  all: ArticleComment[];
  canReply: boolean;
  depth: number;
  onReply: (text: string, parentId: number) => Promise<void>;
  onDelete: (commentId: number) => void;
}

export function CommentItem({ comment, all, canReply, depth, onReply, onDelete }: Props) {
  const [replying, setReplying] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const replies = all.filter((c) => c.parent_id === comment.id);

  return (
    <div className={`${s.comment} ${depth > 0 ? s.reply : ""}`}>
      <div className={s.commentHead}>
        <span className={s.author}>{comment.author_name}</span>
        <time className={s.date} dateTime={comment.created_at}>
          {new Date(comment.created_at).toLocaleString("ru-RU")}
        </time>
      </div>

      <p className={s.text}>{comment.text}</p>

      <div className={s.commentActions}>
        {canReply && (
          <Button variant="transparent" size="sm" onClick={() => setReplying((v) => !v)}>
            Ответить
          </Button>
        )}
        {comment.is_mine && (
          <Button variant="transparent" size="sm" className={s.deleteAction} onClick={() => setConfirmOpen(true)}>
            Удалить
          </Button>
        )}
      </div>

      {replying && (
        <CommentForm
          placeholder="Ваш ответ…"
          submitLabel="Ответить"
          onSubmit={async (text) => {
            await onReply(text, comment.id);
            setReplying(false);
          }}
        />
      )}

      {replies.length > 0 && (
        <div className={s.replies}>
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              all={all}
              canReply={canReply}
              depth={depth + 1}
              onReply={onReply}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      <DeleteCommentModal
        open={confirmOpen}
        onConfirm={() => {
          onDelete(comment.id);
          setConfirmOpen(false);
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
