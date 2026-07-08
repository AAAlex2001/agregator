"use client";

import { useArticleComments, type ArticleComment } from "@/source/entities/article-comment";
import Loader from "@/source/shared/ui/Loader";
import { CommentForm } from "./CommentForm";
import { CommentItem } from "./CommentItem";
import s from "./ArticleDiscussion.module.scss";

interface Props {
  articleId: number;
  initialComments?: ArticleComment[];
}

export function ArticleDiscussion({ articleId, initialComments }: Props) {
  const { comments, loading, add, remove } = useArticleComments(articleId, initialComments);
  const roots = comments.filter((c) => c.parent_id === null);

  return (
    <section className={s.discussion} aria-label="Обсуждение">
      <h2 className={s.title}>
        Обсуждение
        {comments.length > 0 && <span className={s.total}>{comments.length}</span>}
      </h2>

      <CommentForm placeholder="Напишите комментарий..." onSubmit={(text) => add(text, null)} />

      {loading ? (
        <div className={s.loading}>
          <Loader size="md" label="" />
        </div>
      ) : roots.length === 0 ? (
        <p className={s.muted}>Пока нет комментариев. Будьте первым!</p>
      ) : (
        <div className={s.list}>
          {roots.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              all={comments}
              canReply
              depth={0}
              onReply={add}
              onDelete={(id) => void remove(id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
