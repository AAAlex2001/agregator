import { applyArticleMetrics, fetchStaticNewsMetrics } from "@/source/entities/article";
import { getStaticNewsByDirection } from "@/source/entities/static-news";
import { LandingArticlesPreview } from "@/source/widgets/landing/main";

interface Props {
  direction: string;
  subtitle: string;
  basePath?: string;
}

export async function DirectionNews({ direction, subtitle, basePath = "" }: Props) {
  const items = getStaticNewsByDirection(direction);
  if (items.length === 0) return null;

  const metrics = await fetchStaticNewsMetrics(items.map((item) => item.id), { server: true });

  return (
    <LandingArticlesPreview
      title="Новости по направлению"
      subtitle={subtitle}
      ctaHref={`${basePath}/news`}
      ctaLabel="Все новости"
      items={applyArticleMetrics(items, metrics)}
      navPrefix={`direction-news-${direction.toLowerCase()}`}
    />
  );
}
