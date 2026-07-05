import { Card, InfoRow, RatingRing } from "@/shared/ui";
import { ExpertIcon } from "@/shared/ui/icons/expert";
import type { ExpertSummary } from "../../model/api";
import s from "./style.module.scss";

function formatJoined(value: string): string {
  return new Date(value).toLocaleDateString("ru-RU", { month: "long", year: "numeric" });
}

export function ExpertCard({ expert, onClick }: { expert: ExpertSummary; onClick: () => void }) {
  return (
    <Card className={s.card} onClick={onClick}>
      <div className={s.head}>
        <span className={s.avatar}>
          {expert.avatar_url ? <img className={s.photo} src={expert.avatar_url} alt="" /> : <ExpertIcon size={24} />}
        </span>
        <div className={s.identity}>
          <span className={s.name}>{expert.full_name}</span>
          <span className={s.joined}>На платформе с {formatJoined(expert.joined_at)}</span>
        </div>
        {expert.rating !== null && <RatingRing rating={expert.rating} />}
      </div>

      <div className={s.info}>
        <InfoRow label="Выполнено заказов" value={String(expert.completed_orders_count)} />
        <InfoRow label="Отзывов" value={String(expert.review_count)} />
      </div>
    </Card>
  );
}
