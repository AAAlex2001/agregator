import { ArticleCard, type ArticleListItem } from "@/source/entities/article";
import { RelatedSlider } from "@/source/shared/ui/RelatedSlider";

interface ArticlesRelatedSliderProps {
  title: string;
  items: ArticleListItem[];
  cta?: { href: string; label: string };
}

export function ArticlesRelatedSlider({ title, items, cta }: ArticlesRelatedSliderProps) {
  return (
    <RelatedSlider title={title} cta={cta}>
      {items.map((item) => (
        <ArticleCard key={item.id} {...item} />
      ))}
    </RelatedSlider>
  );
}
