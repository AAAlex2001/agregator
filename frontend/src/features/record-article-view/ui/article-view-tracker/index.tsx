"use client";

import { useEffect } from "react";
import { recordArticleView } from "@/entities/article";

/** Идентификатор статьи, открытой посетителем. */
interface ArticleViewTrackerProps {
  articleId: number;
}

/** Регистрирует просмотр статьи после открытия страницы в браузере. */
export function ArticleViewTracker({ articleId }: ArticleViewTrackerProps) {
  useEffect(() => {
    void recordArticleView(articleId);
  }, [articleId]);

  return null;
}
