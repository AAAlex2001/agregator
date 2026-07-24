import { RtnCard, type RtnListItem } from "@/source/entities/rtn-clarification";
import s from "./RtnClarificationView.module.scss";

export function RtnRelatedList({ items }: { items: RtnListItem[] }) {
  return (
    <section className={s.related}>
      <h2 className={s.blockTitle}>Смотрите также</h2>
      <ul className={s.relatedGrid}>
        {items.map((item) => (
          <RtnCard key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
}
