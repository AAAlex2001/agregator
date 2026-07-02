import type { Order } from "@/entites/order";
import { ClockIcon } from "@/shared/ui/icons/interface";
import { formatDeadline } from "../../model/format";
import s from "./info-step.module.scss";
import c from "./common.module.scss";

export function InfoStep({ order }: { order: Order }) {
  return (
    <div className={c.step}>
      <div className={s.block}>
        <p className={s.blockTitle}>Заказ</p>
        <div className={s.hero}>
          <p className={s.orderTitle}>{order.title}</p>
          <div className={s.priceRow}>
            <div className={s.priceCol}>
              <span className={s.priceLab}>Начальная цена</span>
              <span className={s.price}>{order.sum || "—"}</span>
            </div>
            {order.responses_deadline && (
              <span className={s.deadline}>
                <ClockIcon width={14} height={14} />
                до {formatDeadline(order.responses_deadline)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className={s.block}>
        <p className={s.blockTitle}>Сроки выполнения</p>
        <div className={s.row}>
          <span className={s.rowLab}>Начало работ</span>
          <span className={s.rowVal}>{order.start_date || "—"}</span>
        </div>
        <div className={s.row}>
          <span className={s.rowLab}>Окончание</span>
          <span className={s.rowVal}>{order.date || "—"}</span>
        </div>
      </div>

      <div className={s.block}>
        <p className={s.blockTitle}>Заказчик</p>
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

      {order.badges.length > 0 && (
        <div className={s.block}>
          <p className={s.blockTitle}>Требования к эксперту</p>
          <div className={s.chips}>
            {order.badges.map((b, i) => (
              <span key={i} className={s.chip}>
                {b.text}
              </span>
            ))}
          </div>
        </div>
      )}

      {order.comment && (
        <div className={s.block}>
          <p className={s.blockTitle}>Комментарий заказчика</p>
          <p className={s.comment}>{order.comment}</p>
        </div>
      )}
    </div>
  );
}
