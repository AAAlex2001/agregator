import { useEffect, useState } from "react";
import { emitError } from "@/shared/services/error-bus";
import { fetchArticle, type ArticleDetail } from "@/entites/article";

export function useArticle(slug: string | null) {
  const [article, setArticle] = useState<ArticleDetail | null>(null);

  useEffect(() => {
    if (!slug) {
      setArticle(null);
      return;
    }
    let active = true;
    setArticle(null);
    fetchArticle(slug)
      .then((a) => active && setArticle(a))
      .catch((e) => {
        if (active) emitError(e instanceof Error ? e.message : "Не удалось загрузить статью");
      });
    return () => {
      active = false;
    };
  }, [slug]);

  return { article };
}
