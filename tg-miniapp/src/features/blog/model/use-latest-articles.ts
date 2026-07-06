import { useEffect, useState } from "react";
import { listArticles, type ArticleListItem } from "@/entites/article";

export function useLatestArticles(limit = 5) {
  const [items, setItems] = useState<ArticleListItem[] | null>(null);

  useEffect(() => {
    let active = true;
    listArticles("blog", limit)
      .then((r) => active && setItems(r.items))
      .catch(() => active && setItems([]));
    return () => {
      active = false;
    };
  }, [limit]);

  return { items };
}
