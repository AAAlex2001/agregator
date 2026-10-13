import { RelatedSlider } from "@/source/shared/ui/RelatedSlider";
import type { RtnListItem } from "../../model/clarification";
import { RtnCompactCard } from "./RtnCompactCard";

interface RtnRelatedSliderProps {
  items: RtnListItem[];
  basePath: string;
}

/** «Смотрите также» под разъяснением. */
export function RtnRelatedSlider({ items, basePath }: RtnRelatedSliderProps) {
  if (items.length === 0) return null;
  return (
    <RelatedSlider title="Смотрите также">
      {items.map((item) => (
        <RtnCompactCard key={item.id} item={item} basePath={basePath} />
      ))}
    </RelatedSlider>
  );
}
