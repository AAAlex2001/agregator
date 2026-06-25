"use client";

import { useState } from "react";
import type { ArticleComment } from "@/source/entities/article-comment";
import { CommentForm } from "./CommentForm";
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
  const replies = all.filter((c) => c.parent_id === comment.id);

  const remove = () => {
    if (confirm("Удалить комментарий?")) onDelete(comment.id);
  };

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
          <button type="button" className={s.action} onClick={() => setReplying((v) => !v)}>
            Ответить
          </button>
        )}
        {comment.is_mine && (
          <button type="button" className={`${s.action} ${s.danger}`} onClick={remove}>
            Удалить
          </button>
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
    </div>
  );
}
