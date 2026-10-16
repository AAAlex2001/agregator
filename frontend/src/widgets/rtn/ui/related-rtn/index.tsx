import { RtnCompactCard } from "@/entities/rtn";
import type { RtnListItem } from "@/entities/rtn";
import { RelatedSlider } from "@/shared/ui/related-slider";

/** Подборка разъяснений и префикс публичных или кабинетных ссылок. */
interface RelatedRtnProps {
  items: RtnListItem[];
  basePath: string;
}

/** Показывает похожие разъяснения под основным материалом. */
export function RelatedRtn({ items, basePath }: RelatedRtnProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <RelatedSlider title="Смотрите также">
      {items.map((item) => (
        <RtnCompactCard
          key={item.id}
          item={item}
          href={`${basePath}/rtn/${item.slug}`}
        />
      ))}
    </RelatedSlider>
  );
}
