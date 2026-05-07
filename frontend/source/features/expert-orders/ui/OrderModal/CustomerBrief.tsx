import type { Badge, OrderCardData } from "@/source/entities/order";
import s from "./CustomerBrief.module.scss";

const BADGE_CLASS: Record<Badge["variant"], string> = {
  blue: s.badgeBlue,
  green: s.badgeGreen,
  gray: s.badgeGray,
  orange: s.badgeOrange,
  brown: s.badgeBrown,
  purple: s.badgePurple,
};

interface Props {
  order: OrderCardData;
}

function formatResponsesDeadline(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function CustomerBrief({ order }: Props) {
  const isExpired = order.responsesDeadline ? new Date(order.responsesDeadline) <= new Date() : false;

  return (
    <div className={s.block}>
      <div className={s.topRow}>
        <div className={s.topItem}>
          <span className={s.topLabel}>Срок выполнения до</span>
          <span className={s.date}>{order.date}</span>
        </div>
        <div className={s.topItem}>
          <span className={s.topLabel}>Начальная максимальная цена</span>
          <span className={s.sum}>{order.sum}</span>
        </div>
      </div>

      {order.badges.length > 0 && (
        <div className={s.requirements}>
          <span className={s.requirementsLabel}>Требования к эксперту:</span>
          <div className={s.badges}>
            {order.badges.map((badge, index) => (
              <span key={`${badge.text}-${index}`} className={`${s.badge} ${BADGE_CLASS[badge.variant]}`}>
                {badge.text}
              </span>
            ))}
          </div>
        </div>
      )}

      {order.responsesDeadline && (
        <span className={isExpired ? s.responsesDeadlineExpired : s.responsesDeadlineActive}>
          Приём откликов до: {formatResponsesDeadline(order.responsesDeadline)}
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
      </div>

      <div className={s.commentBlock}>
        <span className={s.commentLabel}>Комментарий к заказу</span>
        <div className={s.commentBox}>
          <p className={s.commentText}>{order.comment || "Комментарий отсутствует"}</p>
        </div>
      </div>
    </div>
  );
}