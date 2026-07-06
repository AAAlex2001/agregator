import type { ReactNode } from "react";
import { Card } from "@/shared/ui";
import { CountdownRing } from "@/shared/ui/countdown-ring";
import type { Order } from "../../model/types";
import s from "./style.module.scss";

interface Props {
  order: Order;
  onClick: () => void;
  action?: ReactNode;
}

export function OrderCard({ order, onClick, action }: Props) {
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
          {order.my_answered_questions > 0 && <span className={s.questionBadge}>Ответ на вопрос</span>}
        </div>
        <div className={s.side}>
          <span className={s.sum}>{order.sum}</span>
          <CountdownRing deadline={order.responses_deadline ?? order.deadline_at} from={order.created_at} />
        </div>
      </div>

      {action && (
        <div className={s.action} onClick={(e) => e.stopPropagation()}>
          {action}
        </div>
      )}
    </Card>
  );
}
