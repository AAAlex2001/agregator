import type { ReactNode } from "react";
import styles from "./orderCard.module.scss";
import { BadgesSection, DateMoneySection, OrderInfoSection } from "./sections";
import type { Badge } from "./types";

export interface OrderCardProps {
  badges: Badge[];
  title: string;
  customer: string;
  date: string;
  sum: string;
  responsesDeadline?: string | null;
  onClick?: () => void;
  children?: ReactNode;
}

const OrderCard = ({
  badges,
  title,
  customer,
  date,
  sum,
  responsesDeadline,
  onClick,
  children,
}: OrderCardProps) => {
  return (
    <article className={styles.card} onClick={onClick}>
      <div className={styles.content}>
        <BadgesSection badges={badges} />
        <OrderInfoSection title={title} customer={customer} />
      </div>

      <DateMoneySection date={date} sum={sum} responsesDeadline={responsesDeadline} />
      {children && <div className={styles.cardActions}>{children}</div>}
    </article>
  );
};

export default OrderCard;
