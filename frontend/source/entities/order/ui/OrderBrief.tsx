import cn from "classnames";
import { formatMoscowDateTime } from "@/source/shared/lib/formatDate";
import { isResponsesClosed, type OrderCardData } from "../model/types";
import { OrderDetailsList } from "./OrderDetailsList";
import s from "./OrderBrief.module.scss";

interface OrderBriefProps {
  order: OrderCardData;
}

/** Условия заказа для исполнителя перед откликом: сроки, цена, требования, анкета направления и комментарий. */
export function OrderBrief({ order }: OrderBriefProps) {
  const isExpired = isResponsesClosed(order);

  return (
    <div className={s.block}>
      <div className={s.topRow}>
        <div className={s.topItem}>
          <span className={s.topLabel}>Срок начала выполнения работ</span>
          <span className={s.date}>{order.startDate || "—"}</span>
        </div>
        <div className={s.topItem}>
          <span className={s.topLabel}>Срок окончания выполнения работ</span>
          <span className={s.date}>{order.date}</span>
        </div>
        <div className={s.topItem}>
          <span className={s.topLabel}>Начальная максимальная цена</span>
          <span className={s.sum}>{order.sum}</span>
        </div>
      </div>

      {order.badges.length > 0 && (
        <div className={s.requirements}>
          <span className={s.requirementsLabel}>Требования к исполнителю:</span>
          <div className={s.badges}>
            {order.badges.map((badge) => (
              <span key={badge.text} className={cn(s.badge, s[badge.variant])}>
                {badge.text}
              </span>
            ))}
          </div>
        </div>
      )}

      {order.responsesDeadline && (
        <span className={isExpired ? s.responsesDeadlineExpired : s.responsesDeadlineActive}>
          Приём откликов до (МСК): {formatMoscowDateTime(order.responsesDeadline)}
        </span>
      )}

      <div className={s.textBlock}>
        <div className={s.fieldGroup}>
          <span className={s.fieldLabel}>Название заказа</span>
          <p className={s.title}>{order.title}</p>
        </div>
        <div className={s.fieldGroup}>
          <span className={s.fieldLabel}>Организатор</span>
          <p className={s.customer}>{order.customer}</p>
        </div>
        {order.customerInn && (
          <div className={s.fieldGroup}>
            <span className={s.fieldLabel}>ИНН</span>
            <p className={s.customer}>{order.customerInn}</p>
          </div>
        )}
      </div>

      <OrderDetailsList workType={order.workType} details={order.details} />

      <div className={s.commentBlock}>
        <span className={s.commentLabel}>Комментарий к заказу</span>
        <div className={s.commentBox}>
          <p className={s.commentText}>{order.comment || "Комментарий отсутствует"}</p>
        </div>
      </div>
    </div>
  );
}
