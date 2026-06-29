"use client";

import { useEffect } from "react";
import { recordArticleView } from "@/source/entities/article";
import { useSession } from "@/source/features/session";

export function ArticleViewTracker({ articleId }: { articleId: number }) {
  const { user } = useSession();

  useEffect(() => {
    if (!user) return;
    void recordArticleView(articleId);
  }, [user, articleId]);

  return null;
}
