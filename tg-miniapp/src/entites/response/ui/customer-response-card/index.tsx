import { Card, InfoRow } from "@/shared/ui";
import { ExpertIcon, StarIcon } from "@/shared/ui/icons/expert";
import { pluralRu } from "@/shared/lib/format";
import { VAT_LABEL, type ExpertResponse } from "../../model/types";
import { statusMeta } from "../../model/status";
import s from "./style.module.scss";

export function CustomerResponseCard({ response }: { response: ExpertResponse }) {
  const meta = statusMeta(response.status);

  return (
    <Card className={s.card}>
      <div className={s.header}>
        <span className={s.date}>Отклик от {response.date}</span>
        <span className={s.status} style={{ color: meta.color, background: meta.bg }}>
          {meta.label}
        </span>
      </div>

      <div className={s.expert}>
        <span className={s.avatar}>
          <ExpertIcon size={22} />
        </span>
        <div className={s.identity}>
          <span className={s.name}>{response.expert_name}</span>
          {response.expert_rating !== null && (
            <span className={s.rating}>
              <StarIcon className={s.star} /> {response.expert_rating.toFixed(1)} · {response.expert_review_count}{" "}
              {pluralRu(response.expert_review_count, "отзыв", "отзыва", "отзывов")}
            </span>
          )}
        </div>
      </div>

      <span className={s.title}>{response.order_title}</span>

      <div className={s.info}>
        <InfoRow label="Предложение" value={`${response.proposed_sum} · ${VAT_LABEL[response.vat_kind]}`} accent />
        <InfoRow label="Начальная цена" value={response.order_sum} />
        <InfoRow label="Сроки работ" value={`до ${response.proposed_deadline}`} />
      </div>
    </Card>
  );
}
