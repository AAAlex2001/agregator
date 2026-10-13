import { RtnCard, type RtnListItem } from "@/source/entities/rtn-clarification";
import { RelatedSlider } from "@/source/shared/ui/RelatedSlider";

export function RtnRelatedList({ items }: { items: RtnListItem[] }) {
  return (
    <RelatedSlider title="Смотрите также">
      {items.map((item) => (
        <RtnCard key={item.id} item={item} as="article" />
      ))}
    </RelatedSlider>
  );
}
