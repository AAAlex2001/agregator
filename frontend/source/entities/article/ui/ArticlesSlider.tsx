import { RelatedSlider } from "@/source/shared/ui/RelatedSlider";
import type { ArticleListItem } from "../model/types";
import { ArticleCard } from "./ArticleCard/ArticleCard";

interface ArticlesSliderProps {
  title: string;
  items: ArticleListItem[];
  cta?: { href: string; label: string };
}

/** Горизонтальный слайдер карточек статей: похожие под статьёй или соседний раздел под списком. */
export function ArticlesSlider({ title, items, cta }: ArticlesSliderProps) {
  return (
    <RelatedSlider title={title} cta={cta}>
      {items.map((item) => (
        <ArticleCard key={item.id} article={item} />
      ))}
    </RelatedSlider>
  );
}
