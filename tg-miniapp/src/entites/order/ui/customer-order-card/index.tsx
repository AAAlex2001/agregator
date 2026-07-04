import cn from "classnames";
import { Card } from "@/shared/ui";
import { formatDeadline } from "@/shared/lib/format";
import type { Order } from "../../model/types";
import { CUSTOMER_STATUS_LABEL, customerOrderStatus } from "../../model/customer-status";
import s from "./style.module.scss";

export function CustomerOrderCard({ order, onClick }: { order: Order; onClick: () => void }) {
  const status = customerOrderStatus(order);

  return (
    <Card className={s.card} onClick={onClick}>
      <div className={s.head}>
        <span className={s.meta}>№ {order.id}</span>
        <span className={cn(s.status, s[status])}>{CUSTOMER_STATUS_LABEL[status]}</span>
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
    </Card>
  );
}
