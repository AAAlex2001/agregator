"use client";

import { useState } from "react";
import type { PostComment, ThreadPage } from "@/source/entities/posts";
import { CommentForm, useComments } from "@/source/features/posts/comments";
import Button from "@/source/shared/ui/Button";
import { Title } from "@/source/shared/ui/Typography";
import { CommentThread } from "./CommentThread";
import s from "./comments.module.scss";

interface PostCommentsProps {
  postId: number;
  initial: ThreadPage;
}

/** Обсуждение публикации: новый комментарий, ветки с ответами и «Загрузить ещё». */
export function PostComments({ postId, initial }: PostCommentsProps) {
  const list = useComments(postId, initial);
  const [replyTo, setReplyTo] = useState<PostComment | null>(null);

  const refresh = () => {
    setReplyTo(null);
    void list.reload();
  };

  return (
    <section id="comments" className={s.comments}>
      <Title as="h2" text={`Комментарии · ${list.comments_count}`} className={s.title} />
      <CommentForm postId={postId} onSaved={refresh} />
      {list.items.length === 0 && (
        <p className={s.empty}>Комментариев пока нет. Начните обсуждение.</p>
      )}
      <div className={s.list}>
        {list.items.map((thread) => (
          <CommentThread
            key={thread.comment.id}
            postId={postId}
            thread={thread}
            replyTo={replyTo}
            onReply={setReplyTo}
            onChanged={refresh}
          />
        ))}
      </div>
      {list.hasMore && (
        <Button variant="secondary" isLoading={list.isLoading} onClick={list.loadMore}>
          Загрузить ещё
        </Button>
      )}
    </section>
  );
}
