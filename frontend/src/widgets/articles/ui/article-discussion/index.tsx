"use client";

import {
  ArticleCommentsProvider,
  type ArticleComment,
} from "@/entities/article";
import { ArticleDiscussionContent } from "../article-discussion-content";

/** Статья и начальные комментарии для серверного отображения обсуждения. */
interface ArticleDiscussionProps {
  articleId: number;
  initialComments: ArticleComment[];
}

/** Подключает обсуждение и начинает новое состояние при переходе к другой статье. */
export function ArticleDiscussion({
  articleId,
  initialComments,
}: ArticleDiscussionProps) {
  return (
    <ArticleCommentsProvider
      key={articleId}
      articleId={articleId}
      initialComments={initialComments}
    >
      <ArticleDiscussionContent />
    </ArticleCommentsProvider>
  );
}
