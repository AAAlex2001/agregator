"use client";

import cn from "classnames";
import { useState } from "react";
import { RtnCommentContent } from "@/entities/rtn";
import type { RtnComment } from "@/entities/rtn";
import { AddRtnCommentForm } from "@/features/add-rtn-comment";
import {
  DeleteRtnCommentButton,
  DeleteRtnCommentDialog,
  useDeleteRtnComment,
} from "@/features/delete-rtn-comment";
import { RtnCommentReactions } from "@/features/react-to-rtn-comment";
import { Button } from "@/shared/ui/button";
import styles from "./style.module.scss";

/** Комментарий и общий порядок обсуждения для построения вложенных ответов. */
interface RtnCommentThreadProps {
  comment: RtnComment;
  comments: RtnComment[];
  isReply?: boolean;
}

/** Собирает содержание комментария, действия и дерево ответов. */
export function RtnCommentThread({
  comment,
  comments,
  isReply = false,
}: RtnCommentThreadProps) {
  const deletion = useDeleteRtnComment(comment.id);
  const [isReplying, setIsReplying] = useState(false);
  const replies = comments.filter((item) => item.parent_id === comment.id);

  /** Открывает или скрывает форму ответа. */
  function toggleReply() {
    setIsReplying((isOpen) => !isOpen);
  }

  /** Скрывает форму после появления ответа в обсуждении. */
  function closeReply() {
    setIsReplying(false);
  }

  return (
    <div
      className={cn(styles.comment, {
        [styles.reply]: isReply,
      })}
    >
      <RtnCommentContent comment={comment} />
      <RtnCommentReactions comment={comment} />
      <div className={styles.actions}>
        <Button
          variant="transparent"
          size="sm"
          onClick={toggleReply}
        >
          Ответить
        </Button>
        {comment.is_mine && (
          <DeleteRtnCommentButton onClick={deletion.open} />
        )}
      </div>

      {isReplying && (
        <AddRtnCommentForm
          parentId={comment.id}
          placeholder="Ваш ответ…"
          submitLabel="Ответить"
          onAdded={closeReply}
        />
      )}

      {replies.length > 0 && (
        <div className={styles.replies}>
          {replies.map((reply) => (
            <RtnCommentThread
              key={reply.id}
              comment={reply}
              comments={comments}
              isReply
            />
          ))}
        </div>
      )}

      <DeleteRtnCommentDialog
        open={deletion.isOpen}
        isBusy={deletion.isDeleting}
        onConfirm={deletion.confirm}
        onCancel={deletion.close}
      />
    </div>
  );
}
