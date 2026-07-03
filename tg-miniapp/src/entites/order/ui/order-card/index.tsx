import { Card } from "@/shared/ui";
import { CountdownBar } from "@/shared/ui/countdown-bar";
import type { Order } from "../../model/api";
import s from "./style.module.scss";

export function OrderCard({ order, onClick }: { order: Order; onClick: () => void }) {
  return (
    <Card className={s.card} onClick={onClick}>
      <div className={s.row}>
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
        <span className={s.sum}>{order.sum}</span>
      </div>

      <CountdownBar
        deadline={order.responses_deadline ?? order.deadline_at}
        from={order.created_at}
        label="Приём откликов"
      />
    </Card>
  );
}
