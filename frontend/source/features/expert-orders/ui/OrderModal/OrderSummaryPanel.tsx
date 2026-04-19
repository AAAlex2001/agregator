import type { Badge, OrderCardData } from "@/source/entities/order";
import s from "./orderFlow.module.scss";

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

export function OrderSummaryPanel({ order }: Props) {
  return (
    <div className={s.summaryCard}>
      <div className={s.summaryTitleRow}>
        <span className={s.summaryTitle}>{order.title}</span>
        <svg className={s.summaryChevron} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 9L12 15L18 9" stroke="#FFDDA9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <span className={s.summaryCustomer}>{order.customer}</span>

      <div className={s.summaryMeta}>
        <span className={s.summaryMetaText}>
          <span className={s.summaryMetaLabel}>Срок выполнения:</span> {order.date}
        </span>

        <div className={s.summaryBadges}>
          {order.badges.map((badge, index) => (
            <span key={`${badge.text}-${index}`} className={`${s.badge} ${BADGE_CLASS[badge.variant]}`}>
              {badge.text}
            </span>
          ))}
        </div>

        <span className={s.summaryMetaText}>
          <span className={s.summaryMetaLabel}>Мин. стоимость:</span> {order.sum}
        </span>
      </div>
    </div>
  );
}