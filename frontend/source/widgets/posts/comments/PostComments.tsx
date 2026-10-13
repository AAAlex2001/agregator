"use client";

import { useEffect, useRef, useState } from "react";
import type { PostComment } from "@/source/entities/posts";
import { CommentForm, useComments } from "@/source/features/posts/comments";
import Button from "@/source/shared/ui/Button";
import { EmptyState } from "@/source/shared/ui/EmptyState";
import { CommentsSkeleton } from "../skeleton";
import { CommentThread } from "./CommentThread";
import { Title } from "@/source/shared/ui/Typography";
import s from "./comments.module.scss";

/** Обсуждение публикации с ответами и постраничной загрузкой. */
export function PostComments({ postId }: { postId: number }) {
  const list = useComments(postId);
  const [replyTo, setReplyTo] = useState<PostComment | null>(null);
  const scrolled = useRef(false);
  const changed = () => {
    setReplyTo(null);
    list.reload();
  };
  useEffect(() => {
    if (!scrolled.current && !list.loading && window.location.hash === "#comments") {
      scrolled.current = true;
      document.getElementById("comments")?.scrollIntoView({ block: "start" });
    }
  }, [list.loading]);
  return (
    <section
      id="comments"
      className={s.comments}
    >
      <Title
        as="h2"
        text={`Комментарии · ${list.comments_count}`}
        className={s.title}
      />
      <CommentForm
        postId={postId}
        onSaved={changed}
      />
      {list.error && (
        <div className={s.error} role="alert">
          <EmptyState
            title="Ошибка загрузки"
            subtitle={list.error}
            actionLabel="Повторить"
            onAction={list.reload}
          />
        </div>
      )}
      <div className={s.list}>
        {list.items.map((thread) => (
          <CommentThread
            key={thread.comment.id}
            postId={postId}
            thread={thread}
            replyTo={replyTo}
            onReply={setReplyTo}
            onChanged={changed}
          />
        ))}
      </div>
      {list.loading && <CommentsSkeleton />}
      {!list.loading && !list.error && list.items.length === 0 && (
        <p className={s.empty}>Комментариев пока нет. Начните обсуждение.</p>
      )}
      {list.hasMore && (
        <Button
          variant="secondary"
          disabled={list.loading}
          onClick={list.loadMore}
        >
          Загрузить ещё
        </Button>
      )}
    </section>
  );
}
