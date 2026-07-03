import type { Order } from "@/entites/order";
import { formatDateRu } from "@/shared/lib/format";
import s from "./info-screen.module.scss";
import c from "./common.module.scss";

export function InfoScreen({ order }: { order: Order }) {
  const createdDisplay = order.created_at ? formatDateRu(order.created_at.slice(0, 10)) : "";

  return (
    <>
      <div className={c.group}>
        <span className={c.blockLab}>Заказ</span>
        <div className={c.block}>
          <div className={s.hero}>
            <p className={s.orderTitle}>{order.title}</p>
            <div className={s.metric}>
              <span className={s.metricLab}>Начальная максимальная цена</span>
              <span className={s.metricVal}>{order.sum || "—"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={c.group}>
        <span className={c.blockLab}>Сроки выполнения</span>
        <div className={c.block}>
          <div className={c.row}>
            <span className={c.rowLab}>Срок начала выполнения работ</span>
            <span className={c.rowVal}>{order.start_date || "—"}</span>
          </div>
          <div className={c.row}>
            <span className={c.rowLab}>Срок окончания выполнения работ</span>
            <span className={c.rowVal}>{order.date || "—"}</span>
          </div>
          {createdDisplay && (
            <div className={c.row}>
              <span className={c.rowLab}>Создан</span>
              <span className={c.rowVal}>{createdDisplay}</span>
            </div>
          )}
        </div>
      </div>

      <div className={c.group}>
        <span className={c.blockLab}>Заказчик</span>
        <div className={c.block}>
          <div className={c.row}>
            <span className={c.rowLab}>Организатор</span>
            <span className={c.rowVal}>{order.company || "—"}</span>
          </div>
          {order.customer_inn && (
            <div className={c.row}>
              <span className={c.rowLab}>ИНН</span>
              <span className={c.rowVal}>{order.customer_inn}</span>
            </div>
          )}
        </div>
      </div>

      {order.badges.length > 0 && (
        <div className={c.group}>
          <span className={c.blockLab}>Требования к эксперту</span>
          <div className={c.block}>
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
        <div className={c.group}>
          <span className={c.blockLab}>Комментарий заказчика</span>
          <div className={c.block}>
            <p className={c.comment}>{order.comment}</p>
          </div>
        </div>
      )}
    </>
  );
}
