import { useEffect, useState } from "react";
import { emitError } from "@/shared/services/error-bus";
import { notifyHaptic } from "@/shared/services/telegram";
import { fetchArticleReactions, reactToArticle, type ArticleReactions, type ReactionValue } from "@/entites/article";

export function useReactions(articleId: number | null) {
  const [data, setData] = useState<ArticleReactions | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (articleId === null) {
      setData(null);
      return;
    }
    let active = true;
    setData(null);
    fetchArticleReactions(articleId)
      .then((r) => active && setData(r))
      .catch(() => active && setData(null));
    return () => {
      active = false;
    };
  }, [articleId]);

  const react = async (value: ReactionValue) => {
    if (articleId === null || busy) return;
    setBusy(true);
    try {
      const next = await reactToArticle(articleId, value);
      notifyHaptic("success");
      setData(next);
    } catch (e) {
      emitError(e instanceof Error ? e.message : "Не удалось поставить реакцию");
    } finally {
      setBusy(false);
    }
  };

  return { data, busy, react };
}
