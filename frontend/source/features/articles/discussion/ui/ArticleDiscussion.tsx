"use client";

import type { ArticleComment } from "@/source/entities/article";
import { useArticleComments } from "../model/useArticleComments";
import { CommentForm } from "./CommentForm";
import { CommentItem } from "./CommentItem";
import s from "./ArticleDiscussion.module.scss";

interface ArticleDiscussionProps {
  articleId: number;
  initialComments: ArticleComment[];
}

/** Обсуждение под статьёй: форма нового комментария и дерево ответов. */
export function ArticleDiscussion({ articleId, initialComments }: ArticleDiscussionProps) {
  const { comments, add, remove } = useArticleComments(articleId, initialComments);
  const roots = comments.filter((comment) => comment.parent_id === null);

  return (
    <section className={s.discussion} aria-label="Обсуждение">
      <h2 className={s.title}>
        Обсуждение
        {comments.length > 0 && <span className={s.total}>{comments.length}</span>}
      </h2>

      <CommentForm placeholder="Напишите комментарий..." onSubmit={(text) => add(text, null)} />

      {roots.length === 0 ? (
        <p className={s.muted}>Пока нет комментариев. Будьте первым!</p>
      ) : (
        <div className={s.list}>
          {roots.map((comment) => (
            <CommentItem key={comment.id} comment={comment} all={comments} isReply={false} onReply={add} onDelete={remove} />
          ))}
        </div>
      )}
    </section>
  );
}
