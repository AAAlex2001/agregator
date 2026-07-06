import { Card } from "@/shared/ui";
import { formatDayRu, pluralRu } from "@/shared/lib/format";
import type { ArticleListItem } from "../../model/types";
import s from "./style.module.scss";

interface Props {
  article: ArticleListItem;
  onClick: () => void;
}

export function ArticleRow({ article, onClick }: Props) {
  return (
    <Card className={s.row} onClick={onClick}>
      {article.cover_image && (
        <span className={s.media}>
          <img className={s.image} src={article.cover_image} alt="" loading="lazy" decoding="async" />
        </span>
      )}
      <div className={s.body}>
        <span className={s.title}>{article.title}</span>
        {article.excerpt && <span className={s.excerpt}>{article.excerpt}</span>}
        <span className={s.meta}>
          {article.published_at && <span>{formatDayRu(article.published_at)}</span>}
          <span>
            {article.views_count} {pluralRu(article.views_count, "просмотр", "просмотра", "просмотров")}
          </span>
        </span>
      </div>
    </Card>
  );
}
