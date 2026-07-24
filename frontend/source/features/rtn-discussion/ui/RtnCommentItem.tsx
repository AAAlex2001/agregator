"use client";

import { useState } from "react";
import { Button, Modal } from "@/source/shared/ui";
import { FileIcon } from "@/source/shared/ui/icons";
import type { CommentReactionValue, RtnComment, RtnCommentAttachment } from "@/source/entities/rtn-comment";
import { RtnCommentForm } from "./RtnCommentForm";
import s from "./RtnDiscussion.module.scss";

const REACTIONS: { value: CommentReactionValue; label: string; countKey: keyof RtnComment }[] = [
  { value: "USEFUL", label: "Полезно", countKey: "useful_count" },
  { value: "CLARIFICATION", label: "Есть уточнение", countKey: "clarification_count" },
  { value: "AGREE", label: "Согласен с практикой", countKey: "agree_count" },
];

interface Props {
  comment: RtnComment;
  all: RtnComment[];
  depth: number;
  onReply: (text: string, parentId: number, attachments: RtnCommentAttachment[]) => Promise<void>;
  onDelete: (commentId: number) => void;
  onReact: (commentId: number, value: CommentReactionValue) => Promise<void>;
}

export function RtnCommentItem({ comment, all, depth, onReply, onDelete, onReact }: Props) {
  const [replying, setReplying] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const replies = all.filter((c) => c.parent_id === comment.id);

  return (
    <div className={`${s.comment} ${depth > 0 ? s.reply : ""}`}>
      <div className={s.commentHead}>
        <span className={s.author}>
          {comment.author.name}
          {comment.author.is_expert && <span className={s.expertBadge}>Эксперт</span>}
        </span>
        <time className={s.date} dateTime={comment.created_at}>
          {new Date(comment.created_at).toLocaleString("ru-RU")}
        </time>
      </div>

      <p className={s.text}>{comment.text}</p>

      {comment.attachments.length > 0 && (
        <ul className={s.attachmentList}>
          {comment.attachments.map((attachment) => (
            <li key={attachment.url}>
              <a href={attachment.url} target="_blank" rel="noreferrer" className={s.attachmentLink}>
                <FileIcon className={s.attachmentIcon} />
                {attachment.name}
              </a>
            </li>
          ))}
        </ul>
      )}

      <div className={s.reactionsRow}>
        {REACTIONS.map((reaction) => (
          <button
            key={reaction.value}
            type="button"
            className={`${s.reactionBtn} ${comment.my_reaction === reaction.value ? s.reactionActive : ""}`}
            onClick={() => void onReact(comment.id, reaction.value)}
          >
            {reaction.label}
            <span className={s.reactionCount}>{comment[reaction.countKey] as number}</span>
          </button>
        ))}
      </div>

      <div className={s.commentActions}>
        <Button variant="transparent" size="sm" onClick={() => setReplying((v) => !v)}>
          Ответить
        </Button>
        {comment.is_mine && (
          <Button variant="transparent" size="sm" className={s.deleteAction} onClick={() => setConfirmOpen(true)}>
            Удалить
          </Button>
        )}
      </div>

      {replying && (
        <RtnCommentForm
          placeholder="Ваш ответ…"
          submitLabel="Ответить"
          onSubmit={async (text, attachments) => {
            await onReply(text, comment.id, attachments);
            setReplying(false);
          }}
        />
      )}

      {replies.length > 0 && (
        <div className={s.replies}>
          {replies.map((reply) => (
            <RtnCommentItem
              key={reply.id}
              comment={reply}
              all={all}
              depth={depth + 1}
              onReply={onReply}
              onDelete={onDelete}
              onReact={onReact}
            />
          ))}
        </div>
      )}

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} size="sm" ariaLabelledBy="delete-rtn-comment-title">
        <h2 id="delete-rtn-comment-title" className={s.modalTitle}>
          Удалить комментарий?
        </h2>
        <p className={s.modalDesc}>Комментарий и ответы на него удалятся безвозвратно.</p>
        <div className={s.modalButtons}>
          <Button variant="chat" fullWidth onClick={() => setConfirmOpen(false)}>
            Отмена
          </Button>
          <Button
            variant="danger"
            fullWidth
            onClick={() => {
              onDelete(comment.id);
              setConfirmOpen(false);
            }}
          >
            Удалить
          </Button>
        </div>
      </Modal>
    </div>
  );
}
