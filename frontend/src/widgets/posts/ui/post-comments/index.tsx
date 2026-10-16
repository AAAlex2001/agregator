"use client";

import { useState } from "react";
import { usePostComments } from "@/entities/post";
import type { PostComment, PostCommentPage } from "@/entities/post";
import { CommentForm } from "@/features/write-post-comment";
import { Button } from "@/shared/ui/button";
import { Title } from "@/shared/ui/title";
import { usePostsLogin } from "../../model/login-context";
import { CommentThread } from "../comment-thread";
import styles from "./style.module.scss";

/** Публикация и первая страница обсуждения из серверной разметки. */
interface PostCommentsProps {
  postId: number;
  initial: PostCommentPage;
}

/** Обсуждение публикации: новый комментарий, ветки с ответами и «Загрузить ещё». */
export function PostComments({ postId, initial }: PostCommentsProps) {
  const openLogin = usePostsLogin();
  const {
    page,
    isLoading,
    hasMore,
    reload,
    loadMore,
  } = usePostComments(postId, initial);
  const [replyTo, setReplyTo] = useState<PostComment | null>(null);

  /** Закрывает форму ответа и перечитывает обсуждение после изменения. */
  function refresh() {
    setReplyTo(null);
    void reload();
  }

  return (
    <section
      id="comments"
      className={styles.comments}
    >
      <Title
        as="h2"
        text={`Комментарии · ${page.comments_count}`}
        className={styles.title}
      />
      <CommentForm
        postId={postId}
        onSaved={refresh}
        onLogin={openLogin}
      />
      {page.items.length === 0 && (
        <p className={styles.empty}>Комментариев пока нет. Начните обсуждение.</p>
      )}
      <div className={styles.list}>
        {page.items.map((thread) => (
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
      {hasMore && (
        <Button
          variant="secondary"
          isLoading={isLoading}
          onClick={loadMore}
        >
          Загрузить ещё
        </Button>
      )}
    </section>
  );
}
