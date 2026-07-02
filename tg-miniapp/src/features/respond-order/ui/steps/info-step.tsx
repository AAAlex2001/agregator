import type { Order } from "@/entites/order";
import { ClockIcon } from "@/shared/ui/icons/interface";
import { formatDeadline } from "../../model/format";
import s from "./info-step.module.scss";
import c from "./common.module.scss";

export function InfoStep({ order }: { order: Order }) {
  return (
    <div className={c.step}>
      <div className={s.hero}>
        <p className={s.heroTitle}>{order.title}</p>
        <div className={s.priceRow}>
          <div className={s.priceCol}>
            <span className={s.priceLab}>Начальная цена</span>
            <span className={s.price}>{order.sum || "—"}</span>
          </div>
          {order.responses_deadline && (
            <span className={s.deadline}>
              <ClockIcon width={15} height={15} />
              до {formatDeadline(order.responses_deadline)}
            </span>
          )}
        </div>
      </div>

      <div className={s.group}>
        <span className={c.blockLab}>Сроки выполнения</span>
        <div className={s.metrics}>
          <div className={s.metric}>
            <span className={s.mCap}>Начало</span>
            <span className={s.mVal}>{order.start_date || "—"}</span>
          </div>
          <div className={s.metric}>
            <span className={s.mCap}>Окончание</span>
            <span className={s.mVal}>{order.date || "—"}</span>
          </div>
        </div>
      </div>

      <div className={s.group}>
        <span className={c.blockLab}>Заказчик</span>
        <div className={s.info}>
          <div className={s.infoRow}>
            <span className={s.infoLab}>Организатор</span>
            <span className={s.infoVal}>{order.company || "—"}</span>
          </div>
          {order.customer_inn && (
            <div className={s.infoRow}>
              <span className={s.infoLab}>ИНН</span>
              <span className={s.infoVal}>{order.customer_inn}</span>
            </div>
          )}
        </div>
      </div>

      {order.badges.length > 0 && (
        <div className={s.group}>
          <span className={c.blockLab}>Требования к эксперту</span>
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
        <div className={s.group}>
          <span className={c.blockLab}>Комментарий заказчика</span>
          <p className={s.comment}>{order.comment}</p>
        </div>
      )}
    </div>
  );
}
