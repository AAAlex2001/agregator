import type { PostComment, CommentThread as Thread } from "@/source/entities/posts";
import { CommentForm } from "@/source/features/posts/comments";
import { CommentItem } from "./CommentItem";
import s from "./comments.module.scss";

interface Props {
  postId: number;
  thread: Thread;
  replyTo: PostComment | null;
  onReply: (comment: PostComment | null) => void;
  onChanged: () => void;
}

/** Собирает корневой комментарий, ответы и форму ответа внутри ветки. */
export function CommentThread({ postId, thread, replyTo, onReply, onChanged }: Props) {
  const root = thread.comment;
  const replying = replyTo && (replyTo.id === root.id || replyTo.parent_id === root.id);
  return (
    <CommentItem
      postId={postId}
      comment={root}
      onReply={onReply}
      onChanged={onChanged}
    >
      {(thread.replies.length > 0 || replying) && (
        <div className={s.thread}>
          {thread.replies.map((comment) => (
            <CommentItem
              key={comment.id}
              postId={postId}
              comment={comment}
              onReply={onReply}
              onChanged={onChanged}
            />
          ))}
          {replying && (
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
