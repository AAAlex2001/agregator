"use client";

import { useArticleComments } from "@/entities/article";
import { AddArticleCommentForm } from "@/features/add-article-comment";
import { ArticleCommentThread } from "../article-comment-thread";
import styles from "./style.module.scss";

/** Собирает заголовок обсуждения, форму и дерево комментариев. */
export function ArticleDiscussionContent() {
  const { comments } = useArticleComments();
  const roots = comments.filter((comment) => comment.parent_id === null);

  return (
    <section
      className={styles.discussion}
      aria-label="Обсуждение"
    >
      <h2 className={styles.title}>
        Обсуждение
        {comments.length > 0 && (
          <span className={styles.total}>
            {comments.length}
          </span>
        )}
      </h2>

      <AddArticleCommentForm placeholder="Напишите комментарий..." />

      {roots.length === 0 ? (
        <p className={styles.muted}>
          Пока нет комментариев. Будьте первым!
        </p>
      ) : (
        <div className={styles.list}>
          {roots.map((comment) => (
            <ArticleCommentThread
              key={comment.id}
              comment={comment}
            />
          ))}
        </div>
      )}
    </section>
  );
}
