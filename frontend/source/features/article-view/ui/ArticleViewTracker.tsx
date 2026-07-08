"use client";

import { useEffect } from "react";
import { recordArticleView } from "@/source/entities/article";

export function ArticleViewTracker({ articleId }: { articleId: number }) {
  useEffect(() => {
    void recordArticleView(articleId);
  }, [articleId]);

  return null;
}
