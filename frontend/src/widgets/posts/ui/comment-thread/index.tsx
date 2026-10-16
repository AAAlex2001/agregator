"use client";

import type { PostComment, PostCommentThread } from "@/entities/post";
import { CommentForm } from "@/features/write-post-comment";
import { usePostsLogin } from "../../model/login-context";
import { CommentItem } from "../comment-item";
import styles from "./style.module.scss";

/** Ветка обсуждения и комментарий, на который сейчас отвечают. */
interface CommentThreadProps {
  postId: number;
  thread: PostCommentThread;
  replyTo: PostComment | null;
  onReply: (comment: PostComment | null) => void;
  onChanged: () => void;
}

/** Ветка: корневой комментарий, ответы и форма ответа, если отвечают в этой ветке. */
export function CommentThread({
  postId,
  thread,
  replyTo,
  onReply,
  onChanged,
}: CommentThreadProps) {
  const openLogin = usePostsLogin();
  const root = thread.comment;
  const isReplyingHere = replyTo !== null
    && (replyTo.id === root.id || replyTo.parent_id === root.id);
  const hasReplies = thread.replies.length > 0;

  return (
    <CommentItem
      postId={postId}
      comment={root}
      onReply={onReply}
      onChanged={onChanged}
    >
      {(hasReplies || isReplyingHere) && (
        <div className={styles.thread}>
          {thread.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              postId={postId}
              comment={reply}
              onReply={onReply}
              onChanged={onChanged}
            />
          ))}
          {isReplyingHere && (
            <CommentForm
              key={replyTo.id}
              postId={postId}
              replyTo={replyTo}
              onSaved={onChanged}
              onCancel={() => onReply(null)}
              onLogin={openLogin}
            />
          )}
        </div>
      )}
    </CommentItem>
  );
}
