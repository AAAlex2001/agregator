import { useEffect, useState } from "react";
import { listArticles, type ArticleKind, type ArticleListItem } from "@/entites/article";

export function useArticles(kind: ArticleKind) {
  const [items, setItems] = useState<ArticleListItem[] | null>(null);

  useEffect(() => {
    let active = true;
    setItems(null);
    listArticles(kind, 48)
      .then((r) => active && setItems(r.items))
      .catch(() => active && setItems([]));
    return () => {
      active = false;
    };
  }, [kind]);

  return { items };
}
