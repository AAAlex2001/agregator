"use client";

import cn from "classnames";
import { useState } from "react";
import { toGalleryItem, type RtnComment, type RtnCommentReaction, type RtnFile } from "@/source/entities/rtn";
import { formatWithTime } from "@/source/shared/lib/formatDate";
import Button from "@/source/shared/ui/Button";
import { ConfirmModal } from "@/source/shared/ui/ConfirmModal";
import { FileGallery } from "@/source/shared/ui/FileGallery";
import { CommentForm } from "./CommentForm";
import { CommentReactions } from "./CommentReactions";
import s from "./CommentItem.module.scss";

interface CommentItemProps {
  comment: RtnComment;
  all: RtnComment[];
  isReply: boolean;
  onReply: (text: string, parentId: number, attachments: RtnFile[]) => Promise<void>;
  onDelete: (commentId: number) => Promise<void>;
  onReact: (commentId: number, value: RtnCommentReaction) => void;
}

/** Комментарий с файлами, реакциями и ответами под ним; свой комментарий можно удалить. */
export function CommentItem({ comment, all, isReply, onReply, onDelete, onReact }: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const replies = all.filter((item) => item.parent_id === comment.id);

  return (
    <div className={cn(s.comment, { [s.reply]: isReply })}>
      <div className={s.head}>
        <span className={s.author}>
          {comment.author.name}
          {comment.author.is_expert && <span className={s.expert}>Исполнитель</span>}
        </span>
        <time className={s.date} dateTime={comment.created_at}>
          {formatWithTime(comment.created_at)}
        </time>
      </div>

      <p className={s.text}>{comment.text}</p>
      {comment.attachments.length > 0 && <FileGallery items={comment.attachments.map(toGalleryItem)} />}

      <CommentReactions comment={comment} onReact={(value) => onReact(comment.id, value)} />

      <div className={s.actions}>
        <Button variant="transparent" size="sm" onClick={() => setIsReplying(!isReplying)}>
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
          onSubmit={async (text, attachments) => {
            await onReply(text, comment.id, attachments);
            setIsReplying(false);
          }}
        />
      )}

      {replies.length > 0 && (
        <div className={s.replies}>
          {replies.map((item) => (
            <CommentItem
              key={item.id}
              comment={item}
              all={all}
              isReply
              onReply={onReply}
              onDelete={onDelete}
              onReact={onReact}
            />
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
