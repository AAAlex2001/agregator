import type { RateArticleProps } from "../../model/types";
import { ArticleRating } from "../article-rating";

/** Начинает отдельное состояние голосования при переходе к другой статье. */
export function RateArticle({ articleId, initial }: RateArticleProps) {
  return (
    <ArticleRating
      key={articleId}
      articleId={articleId}
      initial={initial}
    />
  );
}
