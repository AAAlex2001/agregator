import { Card, CountdownRing } from "@/shared/ui";
import { ChevronRightIcon } from "@/shared/ui/icons/interface";
import type { Order } from "../../model/api";
import s from "./style.module.scss";

export function OrderCard({ order, onClick }: { order: Order; onClick: () => void }) {
  return (
    <Card className={s.card} onClick={onClick}>
      <div className={s.head}>
        <div className={s.headText}>
          <span className={s.title}>{order.title}</span>
          {order.company && <span className={s.company}>{order.company}</span>}
        </div>
        <CountdownRing deadline={order.responses_deadline ?? order.deadline_at} />
      </div>

      {order.badges.length > 0 && (
        <div className={s.badges}>
          {order.badges.slice(0, 4).map((b, i) => (
            <span key={i} className={s.badge}>
              {b.text}
            </span>
          ))}
        </div>
      )}

      <div className={s.foot}>
        <div className={s.priceBlock}>
          <span className={s.priceLab}>Начальная цена</span>
          <span className={s.price}>{order.sum}</span>
        </div>
        <ChevronRightIcon className={s.arrow} width={20} height={20} />
      </div>
    </Card>
  );
}
