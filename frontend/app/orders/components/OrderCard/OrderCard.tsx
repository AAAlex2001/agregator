import styles from "./orderCard.module.scss";
import { BadgesSection, DateMoneySection, OrderInfoSection } from "./sections";
import type { Badge } from "./types";

export interface OrderCardProps {
  badges: Badge[];
  title: string;
  customer: string;
  date: string;
  sum: string;
  onClick?: () => void;
}

const OrderCard = ({
  badges,
  title,
  customer,
  date,
  sum,
  onClick,
}: OrderCardProps) => {
  return (
    <article className={styles.card} onClick={onClick}>
      <div className={styles.content}>
        <BadgesSection badges={badges} />
        <OrderInfoSection title={title} customer={customer} />
      </div>

      <DateMoneySection date={date} sum={sum} />
    </article>
  );
};

export default OrderCard;
