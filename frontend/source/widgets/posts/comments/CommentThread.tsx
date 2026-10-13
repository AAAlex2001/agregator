import type { CommentThread as Thread, PostComment } from "@/source/entities/posts";
import { CommentForm } from "@/source/features/posts/comments";
import { CommentItem } from "./CommentItem";
import s from "./comments.module.scss";

interface CommentThreadProps {
  postId: number;
  thread: Thread;
  replyTo: PostComment | null;
  onReply: (comment: PostComment | null) => void;
  onChanged: () => void;
}

/** Ветка: корневой комментарий, ответы и форма ответа, если отвечают в этой ветке. */
export function CommentThread({ postId, thread, replyTo, onReply, onChanged }: CommentThreadProps) {
  const root = thread.comment;
  const isReplyingHere = replyTo !== null && (replyTo.id === root.id || replyTo.parent_id === root.id);

  return (
    <CommentItem postId={postId} comment={root} onReply={onReply} onChanged={onChanged}>
      {(thread.replies.length > 0 || isReplyingHere) && (
        <div className={s.thread}>
          {thread.replies.map((reply) => (
            <CommentItem key={reply.id} postId={postId} comment={reply} onReply={onReply} onChanged={onChanged} />
          ))}
          {isReplyingHere && (
            <CommentForm
              key={replyTo.id}
              postId={postId}
              replyTo={replyTo}
              onSaved={onChanged}
              onCancel={() => onReply(null)}
            />
          )}
        </div>
      )}
    </CommentItem>
  );
}
