import { Card, CountdownRing } from "@/shared/ui";
import type { Order } from "../../model/api";
import s from "./style.module.scss";

export function OrderCard({ order, onClick }: { order: Order; onClick: () => void }) {
  return (
    <Card className={s.card} onClick={onClick}>
      <div className={s.main}>
        <span className={s.title}>{order.title}</span>
        {order.company && <span className={s.company}>{order.company}</span>}
        {order.badges.length > 0 && (
          <div className={s.badges}>
            {order.badges.slice(0, 4).map((b, i) => (
              <span key={i} className={s.badge}>
                {b.text}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className={s.side}>
        <span className={s.sum}>{order.sum}</span>
        <CountdownRing deadline={order.responses_deadline ?? order.deadline_at} />
      </div>
    </Card>
  );
}
