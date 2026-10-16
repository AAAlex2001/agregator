"use client";

import { useState } from "react";
import { sortRtnComments, useRtnComments } from "@/entities/rtn";
import type { RtnCommentSort } from "@/entities/rtn";
import { AddRtnCommentForm } from "@/features/add-rtn-comment";
import { RtnCommentThread } from "../rtn-comment-thread";
import { RtnDiscussionSort } from "../rtn-discussion-sort";
import styles from "./style.module.scss";

/** Собирает форму комментария, порядок отображения и дерево профессионального обсуждения. */
export function RtnDiscussionContent() {
  const { comments } = useRtnComments();
  const [sort, setSort] = useState<RtnCommentSort>({
    by: null,
    dir: null,
  });
  const sortedComments = sortRtnComments(comments, sort);
  const roots = sortedComments.filter((comment) => comment.parent_id === null);

  return (
    <section
      className={styles.discussion}
      aria-label="Профессиональное обсуждение"
    >
      <header className={styles.head}>
        <h2 className={styles.title}>
          Профессиональное обсуждение
          {comments.length > 0 && (
            <span className={styles.total}>{comments.length}</span>
          )}
        </h2>
        <p className={styles.subtitle}>
          Поделитесь практикой применения этого разъяснения или уточните спорные моменты
          с коллегами.
        </p>
      </header>

      <AddRtnCommentForm placeholder="Ваш комментарий по практике применения…" />

      {roots.length === 0 ? (
        <p className={styles.muted}>Пока нет комментариев. Будьте первым!</p>
      ) : (
        <>
          <RtnDiscussionSort
            sort={sort}
            onChange={setSort}
          />
          <div className={styles.list}>
            {roots.map((comment) => (
              <RtnCommentThread
                key={comment.id}
                comment={comment}
                comments={sortedComments}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
