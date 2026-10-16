import type { ArticleListItem } from "@/entities/article";
import type { DirectionCode } from "@/entities/direction";
import { ArticlesPreview } from "../articles-preview";

/** Новости направления, пояснение блока и префикс ссылок на статьи. */
interface ServiceNewsProps {
  direction: DirectionCode;
  subtitle: string;
  items: ArticleListItem[];
  articleBasePath: string;
}

/** Показывает загруженные приложением новости по выбранному направлению. */
export function ServiceNews({
  direction,
  subtitle,
  items,
  articleBasePath,
}: ServiceNewsProps) {
  return (
    <ArticlesPreview
      title="Новости по направлению"
      subtitle={subtitle}
      ctaHref={`${articleBasePath}/news`}
      ctaLabel="Все новости"
      items={items}
      navPrefix={`direction-news-${direction.toLowerCase()}`}
      articleBasePath={articleBasePath}
    />
  );
}
