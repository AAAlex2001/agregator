import { fetchArticleList } from "@/source/entities/article";
import { LandingArticlesPreview } from "@/source/widgets/landing/main";

interface Props {
  direction: string;
  subtitle: string;
  basePath?: string;
}

export async function DirectionNews({ direction, subtitle, basePath = "" }: Props) {
  const list = await fetchArticleList({ kind: "news", direction, limit: 12 }, { server: true }).catch(() => null);
  if (!list || list.items.length === 0) return null;

  return (
    <LandingArticlesPreview
      title="Новости по направлению"
      subtitle={subtitle}
      ctaHref={`${basePath}/news`}
      ctaLabel="Все новости"
      items={list.items}
      navPrefix={`direction-news-${direction.toLowerCase()}`}
    />
  );
}
