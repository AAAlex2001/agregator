import type { Order } from "@/entites/order";
import { formatDeadline } from "@/shared/lib/format";
import s from "./info-step.module.scss";
import c from "./common.module.scss";

export function InfoStep({ order }: { order: Order }) {
  return (
    <div className={c.step}>
      <div className={s.group}>
        <span className={c.blockLab}>Заказ</span>
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
      </div>

      <div className={s.group}>
        <span className={c.blockLab}>Сроки выполнения</span>
        <div className={s.block}>
          <div className={s.row}>
            <span className={s.rowLab}>Начало работ</span>
            <span className={s.rowVal}>{order.start_date || "—"}</span>
          </div>
          <div className={s.row}>
            <span className={s.rowLab}>Окончание</span>
            <span className={s.rowVal}>{order.date || "—"}</span>
          </div>
        </div>
      </div>

      <div className={s.group}>
        <span className={c.blockLab}>Заказчик</span>
        <div className={s.block}>
          <div className={s.row}>
            <span className={s.rowLab}>Организатор</span>
            <span className={s.rowVal}>{order.company || "—"}</span>
          </div>
          {order.customer_inn && (
            <div className={s.row}>
              <span className={s.rowLab}>ИНН</span>
              <span className={s.rowVal}>{order.customer_inn}</span>
            </div>
          )}
        </div>
      </div>

      {order.badges.length > 0 && (
        <div className={s.group}>
          <span className={c.blockLab}>Требования к эксперту</span>
          <div className={s.block}>
            <div className={s.chips}>
              {order.badges.map((b, i) => (
                <span key={i} className={s.chip}>
                  {b.text}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {order.comment && (
        <div className={s.group}>
          <span className={c.blockLab}>Комментарий заказчика</span>
          <div className={s.block}>
            <p className={s.comment}>{order.comment}</p>
          </div>
        </div>
      )}
    </div>
  );
}
