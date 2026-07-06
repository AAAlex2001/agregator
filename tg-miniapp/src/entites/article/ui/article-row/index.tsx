import { Card } from "@/shared/ui";
import { formatDayRu, pluralRu } from "@/shared/lib/format";
import type { ArticleListItem } from "../../model/types";
import s from "./style.module.scss";

interface Props {
  article: ArticleListItem;
  onClick: () => void;
}

function ThumbMini({ down }: { down?: boolean }) {
  return (
    <svg
      width={13}
      height={13}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={down ? { transform: "rotate(180deg)" } : undefined}
    >
      <path d="M7 10v11" />
      <path d="M7 10 11 3a2 2 0 0 1 2.6 1.2l.4 1.3a2 2 0 0 0 0 .5l-1 3.5h5.5a2 2 0 0 1 2 2.5l-1.6 6A2 2 0 0 1 18 22H7" />
    </svg>
  );
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
        <div className={s.head}>
          <span className={s.title}>{article.title}</span>
          <span className={s.likes}>
            <span className={s.like}>
              <ThumbMini /> {article.likes_count}
            </span>
            <span className={s.like}>
              <ThumbMini down /> {article.dislikes_count}
            </span>
          </span>
        </div>
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
