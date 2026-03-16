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
}

const OrderCard = ({
  badges,
  title,
  customer,
  date,
  sum,
  responsesDeadline,
  onClick,
}: OrderCardProps) => {
  return (
    <article className={styles.card} onClick={onClick}>
      <div className={styles.content}>
        <BadgesSection badges={badges} />
        <OrderInfoSection title={title} customer={customer} />
      </div>

      <DateMoneySection date={date} sum={sum} responsesDeadline={responsesDeadline} />
    </article>
  );
};

export default OrderCard;
