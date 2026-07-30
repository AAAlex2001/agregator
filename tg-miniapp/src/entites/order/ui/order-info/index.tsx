import { Field, InfoRow } from "@/shared/ui";
import { formatDeadline } from "@/shared/lib/format";
import type { Order } from "../../model/types";
import { getOrderWorkLabel } from "../../model/work-types";
import s from "./style.module.scss";

export function OrderInfo({ order }: { order: Order }) {
  return (
    <div className={s.wrap}>
      <Field label="Заказ">
        <div className={s.block}>
          <div className={s.hero}>
            <p className={s.orderTitle}>{order.title}</p>
            <div className={s.metrics}>
              <div className={s.metric}>
                <span className={s.metricLab}>Начальная цена</span>
                <span className={s.metricVal}>{order.sum || "—"}</span>
              </div>
              {order.responses_deadline && (
                <div className={`${s.metric} ${s.metricEnd}`}>
                  <span className={s.metricLab}>Срок приёма откликов</span>
                  <span className={s.metricVal}>{formatDeadline(order.responses_deadline)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Field>

      <Field label="Сроки выполнения">
        <div className={s.block}>
          <InfoRow label="Начало работ" value={order.start_date || "—"} />
          <InfoRow label="Окончание" value={order.date || "—"} />
        </div>
      </Field>

      <Field label="Вид работ">
        <div className={s.block}>
          <InfoRow label="Категория" value={getOrderWorkLabel(order.work_type ?? "EXPERTISE")} />
        </div>
      </Field>

      <Field label="Заказчик">
        <div className={s.block}>
          <InfoRow label="Организатор" value={order.company || "—"} />
          {order.customer_inn && <InfoRow label="ИНН" value={order.customer_inn} />}
        </div>
      </Field>

      {order.badges.length > 0 && (
        <Field label="Требования к исполнителю">
          <div className={s.block}>
            <div className={s.chips}>
              {order.badges.map((b, i) => (
                <span key={i} className={s.chip}>
                  {b.text}
                </span>
              ))}
            </div>
          </div>
        </Field>
      )}

      {order.comment && (
        <Field label="Комментарий заказчика">
          <div className={s.block}>
            <p className={s.comment}>{order.comment}</p>
          </div>
        </Field>
      )}
    </div>
  );
}
