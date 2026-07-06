import { Button, Card } from "@/shared/ui";
import { formatDeadline, pluralRu } from "@/shared/lib/format";
import type { Order } from "../../model/types";
import { customerOrderStatus } from "../../model/customer-status";
import s from "./style.module.scss";

interface Props {
  order: Order;
  onClick: () => void;
  onEdit?: (order: Order) => void;
}

export function CustomerOrderCard({ order, onClick, onEdit }: Props) {
  const status = customerOrderStatus(order);

  return (
    <Card className={s.card} onClick={onClick}>
      <div className={s.head}>
        <span className={s.meta}>№ {order.id}</span>
      </div>

      <span className={s.title}>{order.title}</span>

      <div className={s.row}>
        <span className={s.sum}>{order.sum}</span>
        {status === "active" && order.responses_deadline && (
          <span className={s.deadline}>отклики до {formatDeadline(order.responses_deadline)}</span>
        )}
        {status === "inwork" && order.executor_name && <span className={s.executor}>{order.executor_name}</span>}
      </div>

      {order.badges.length > 0 && (
        <div className={s.badges}>
          {order.badges.slice(0, 4).map((b, i) => (
            <span key={i} className={s.badge}>
              {b.text}
            </span>
          ))}
          {order.badges.length > 4 && <span className={s.badge}>+{order.badges.length - 4}</span>}
        </div>
      )}

      {order.unanswered_questions > 0 && (
        <span className={s.questionBadge}>
          {order.unanswered_questions}{" "}
          {pluralRu(order.unanswered_questions, "новый вопрос", "новых вопроса", "новых вопросов")}
        </span>
      )}

      {onEdit && status === "active" && (
        <div className={s.editRow} onClick={(e) => e.stopPropagation()}>
          <Button className={s.editBtn} variant="outline" onClick={() => onEdit(order)}>
            Редактировать
          </Button>
        </div>
      )}
    </Card>
  );
}
