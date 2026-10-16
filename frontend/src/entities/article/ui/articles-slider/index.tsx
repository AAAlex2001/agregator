import { RelatedSlider } from "@/shared/ui/related-slider";
import type { ArticleListItem } from "../../model/types";
import { ArticleCard } from "../article-card";

/** Подборка статей и префикс адресов текущего раздела приложения. */
interface ArticlesSliderProps {
  title: string;
  items: ArticleListItem[];
  sectionHrefPrefix?: string;
  cta?: {
    href: string;
    label: string;
  };
}

/** Собирает карточки похожих статей или публикаций соседнего раздела. */
export function ArticlesSlider({
  title,
  items,
  sectionHrefPrefix = "",
  cta,
}: ArticlesSliderProps) {
  return (
    <RelatedSlider
      title={title}
      cta={cta}
    >
      {items.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          href={`${sectionHrefPrefix}/${article.kind}/${article.slug}`}
        />
      ))}
    </RelatedSlider>
  );
}
