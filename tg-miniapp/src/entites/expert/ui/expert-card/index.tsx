import { Card } from "@/shared/ui";
import { ExpertIcon, StarIcon } from "@/shared/ui/icons/expert";
import { ChevronRightIcon } from "@/shared/ui/icons/interface";
import { pluralRu } from "@/shared/lib/format";
import type { ExpertSummary } from "../../model/api";
import s from "./style.module.scss";

export function ExpertCard({ expert, onClick }: { expert: ExpertSummary; onClick: () => void }) {
  return (
    <Card className={s.card} onClick={onClick}>
      <span className={s.avatar}>
        {expert.avatar_url ? <img className={s.photo} src={expert.avatar_url} alt="" /> : <ExpertIcon size={24} />}
      </span>
      <div className={s.main}>
        <span className={s.name}>{expert.full_name}</span>
        <span className={s.meta}>
          {expert.rating !== null && (
            <span className={s.rating}>
              <StarIcon className={s.star} /> {expert.rating.toFixed(1)}
            </span>
          )}
          {expert.review_count} {pluralRu(expert.review_count, "отзыв", "отзыва", "отзывов")} ·{" "}
          {expert.completed_orders_count} {pluralRu(expert.completed_orders_count, "заказ", "заказа", "заказов")}
        </span>
      </div>
      <ChevronRightIcon className={s.chev} width={18} height={18} />
    </Card>
  );
}
