"use client";

import { useEffect } from "react";
import { recordArticleView } from "../api/article.api";

interface ArticleViewTrackerProps {
  articleId: number;
}

/** Засчитывает просмотр статьи, когда она открыта в браузере. */
export function ArticleViewTracker({ articleId }: ArticleViewTrackerProps) {
  useEffect(() => {
    recordArticleView(articleId);
  }, [articleId]);

  return null;
}
