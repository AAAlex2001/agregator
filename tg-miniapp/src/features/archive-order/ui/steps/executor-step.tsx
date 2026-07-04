import { Field, InfoRow } from "@/shared/ui";
import { ExpertIcon } from "@/shared/ui/icons/expert";
import { ReviewStarIcon } from "@/shared/ui/icons/interface";
import { pluralRu } from "@/shared/lib/format";
import type { Order } from "@/entites/order";
import { FileRow } from "../file-row";
import s from "./executor-step.module.scss";

export function ExecutorStep({ order }: { order: Order }) {
  return (
    <div className={s.wrap}>
      <div className={s.head}>
        <span className={s.avatar}>
          <ExpertIcon size={30} />
        </span>
        <div className={s.identity}>
          <span className={s.name}>{order.executor_name}</span>
          {order.executor_rating !== null && (
            <span className={s.rating}>
              <ReviewStarIcon active width={14} height={14} /> {order.executor_rating.toFixed(1)} ·{" "}
              {order.executor_review_count} {pluralRu(order.executor_review_count, "отзыв", "отзыва", "отзывов")}
            </span>
          )}
        </div>
      </div>

      <Field label="Предложение исполнителя">
        <div className={s.block}>
          <InfoRow label="Стоимость" value={order.executor_proposed_sum || "—"} />
          <InfoRow label="Начало работ" value={order.executor_proposed_start_date || "—"} />
          <InfoRow label="Окончание" value={order.executor_proposed_deadline || "—"} />
        </div>
      </Field>

      {order.executor_comment && (
        <Field label="Комментарий исполнителя">
          <div className={s.commentBlock}>
            <p className={s.comment}>{order.executor_comment}</p>
          </div>
        </Field>
      )}

      {order.executor_files.length > 0 && (
        <Field label="Файлы исполнителя">
          <div className={s.files}>
            {order.executor_files.map((url) => (
              <FileRow key={url} url={url} />
            ))}
          </div>
        </Field>
      )}
    </div>
  );
}
